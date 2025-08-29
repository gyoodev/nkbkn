
'use server';

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCommentsForPost } from "@/lib/data";
import type { Comment } from "@/lib/types";

const CommentSchema = z.object({
  content: z.string().min(3, "Коментарът трябва да е поне 3 символа."),
  post_id: z.coerce.number(),
  guest_name: z.string().optional(),
});

type CommentState = {
  success: boolean;
  error?: string | null;
  newComment?: Comment;
};

export async function addComment(prevState: CommentState, formData: FormData): Promise<CommentState> {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const validatedFields = CommentSchema.safeParse({
    content: formData.get('content'),
    post_id: formData.get('post_id'),
    guest_name: formData.get('guest_name'),
  });

  if (!validatedFields.success) {
    return { success: false, error: validatedFields.error.flatten().fieldErrors.content?.[0] };
  }
  
  const { content, post_id, guest_name } = validatedFields.data;

  if (!user && (!guest_name || guest_name.trim() === '')) {
      return { success: false, error: 'Името за гост е задължително.' };
  }

  const { data: newComment, error } = await supabase
    .from('comments')
    .insert({
      content,
      post_id,
      user_id: user?.id || null,
      guest_name: user ? null : guest_name,
    })
    .select(`
        *,
        profiles ( id, full_name, username, avatar_url )
    `)
    .single();


  if (error) {
    console.error("Comment error:", error);
    return { success: false, error: "Неуспешно добавяне на коментар." };
  }

  revalidatePath(`/news/${post_id}`);
  
  return { success: true, newComment: newComment as Comment };
}

type LikeState = {
    success: boolean;
    error?: string;
    newLikes?: number;
}

export async function likePost(postId: number): Promise<LikeState> {
    const supabase = createServerClient();

    // In a real app, you'd want to use a more robust RPC call that checks
    // if the user has already liked the post to prevent multiple likes.
    // For this demo, we'll do a simple increment.
    
    // 1. Get current likes
    const { data: post, error: fetchError } = await supabase
        .from('news_posts')
        .select('likes')
        .eq('id', postId)
        .single();
    
    if (fetchError || !post) {
        return { success: false, error: 'Публикацията не е намерена.' };
    }

    // 2. Increment and update
    const newLikes = (post.likes || 0) + 1;
    const { error: updateError } = await supabase
        .from('news_posts')
        .update({ likes: newLikes })
        .eq('id', postId);

    if (updateError) {
        console.error("Like error:", updateError);
        return { success: false, error: 'Неуспешно харесване на публикацията.' };
    }

    revalidatePath(`/news/${postId}`);
    revalidatePath('/news');

    return { success: true, newLikes };
}

