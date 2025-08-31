'use server';

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
