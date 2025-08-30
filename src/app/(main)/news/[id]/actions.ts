
'use server';

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Comment } from "@/lib/types";

// Schema for guest comments
const GuestCommentSchema = z.object({
  content: z.string().min(3, "Коментарът трябва да е поне 3 символа."),
  post_id: z.coerce.number(),
  guest_name: z.string().min(3, "Името за гост трябва да е поне 3 символа."),
});

// Schema for user comments
const UserCommentSchema = z.object({
  content: z.string().min(3, "Коментарът трябва да е поне 3 символа."),
  post_id: z.coerce.number(),
});


type CommentState = {
  success: boolean;
  error?: string | null;
  newComment?: Comment;
};

export async function addComment(prevState: CommentState, formData: FormData): Promise<CommentState> {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const content = formData.get('content') as string;
  const postId = formData.get('post_id') as string;
  const guestName = formData.get('guest_name') as string;


  let dataToInsert: {
    content: string;
    post_id: number;
    user_id?: string;
    guest_name?: string;
  };
  
  if (user) {
     // Handle registered user
    const validatedFields = UserCommentSchema.safeParse({
        content: content,
        post_id: postId
    });

    if (!validatedFields.success) {
        return { success: false, error: validatedFields.error.flatten().fieldErrors.content?.[0] };
    }

    dataToInsert = {
        ...validatedFields.data,
        user_id: user.id
    };
  } else {
    // Handle guest user
    const validatedFields = GuestCommentSchema.safeParse({
        content: content,
        post_id: postId,
        guest_name: guestName
    });

    if (!validatedFields.success) {
        const fieldErrors = validatedFields.error.flatten().fieldErrors;
        const errorMessage = fieldErrors.content?.[0] || fieldErrors.guest_name?.[0] || 'Моля, попълнете формата коректно.';
        return { success: false, error: errorMessage };
    }
    
    dataToInsert = {
        ...validatedFields.data,
    };
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

  revalidatePath(`/news/${postId}`);
  
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
