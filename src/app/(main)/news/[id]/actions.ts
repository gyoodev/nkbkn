
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

  const dataToInsert: {
    content: string;
    post_id: number;
    user_id?: string;
    guest_name?: string;
  } = {
    content,
    post_id,
  };

  if (user) {
    dataToInsert.user_id = user.id;
  } else {
    dataToInsert.guest_name = guest_name;
  }


  const { data: newCommentData, error } = await supabase
    .from('comments')
    .insert(dataToInsert)
    .select(`
        *,
        profiles ( id, full_name, username, avatar_url )
    `)
    .single();


  if (error || !newCommentData) {
    console.error("Comment error:", error);
    return { success: false, error: "Неуспешно добавяне на коментар." };
  }

  revalidatePath(`/news/${post_id}`);
  
  return { success: true, newComment: newCommentData as Comment };
}

type LikeState = {
    success: boolean;
    error?: string;
    newLikes?: number;
}

export async function likePost(postId: number): Promise<LikeState> {
    const supabase = createServerClient();

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


export async function incrementViews(postId: number) {
    const supabase = createServerClient();
    
    // In a real-world scenario, you might want to prevent spamming views.
    // For this app, a simple increment is sufficient.
    const { data, error: fetchError } = await supabase
      .from('news_posts')
      .select('views')
      .eq('id', postId)
      .single();

    if (fetchError || !data) {
        // Don't return an error to the client, just log it.
        // Failing to increment views shouldn't break the page.
        console.error(`Error fetching views for post ${postId}:`, fetchError);
        return;
    }

    const newViews = (data.views || 0) + 1;

    const { error: updateError } = await supabase
        .from('news_posts')
        .update({ views: newViews })
        .eq('id', postId);

    if (updateError) {
        console.error(`Error incrementing views for post ${postId}:`, updateError);
    } else {
        // Revalidate the path to show the new view count on next navigation.
        revalidatePath(`/news/${postId}`);
    }
}
