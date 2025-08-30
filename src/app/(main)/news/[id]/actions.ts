
'use server';

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
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

  const guestName = formData.get('guest_name') as string;

  const validatedFields = CommentSchema.safeParse({
    content: formData.get('content'),
    post_id: formData.get('post_id'),
    guest_name: guestName,
  });

  if (!validatedFields.success) {
    return { success: false, error: validatedFields.error.flatten().fieldErrors.content?.[0] };
  }
  
  const { content, post_id, guest_name } = validatedFields.data;

  // If user is not logged in, guest_name is required and should be valid
  if (!user) {
      if (!guest_name || guest_name.trim() === '') {
          return { success: false, error: 'Името за гост е задължително.' };
      }
      if (guest_name.trim().length < 3) {
          return { success: false, error: 'Името за гост трябва да е поне 3 символа.' };
      }
  }


  const { data: newCommentData, error } = await supabase
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
    `);


  if (error || !newCommentData) {
    console.error("Comment error:", error);
    return { success: false, error: "Неуспешно добавяне на коментар." };
  }

  revalidatePath(`/news/${post_id}`);
  
  // The insert operation returns an array, so we take the first element.
  return { success: true, newComment: newCommentData[0] as Comment };
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
