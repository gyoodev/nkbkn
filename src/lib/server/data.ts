

import 'server-only';

import type { Jockey, Trainer, Horse, RaceEvent, Result, Partner, SiteContent, NewsPost, Comment } from '@/lib/types';
import { createServerClient } from '../supabase/server';

export async function getJockey(id: number): Promise<Jockey | null> {
    const supabase = createServerClient();
    const { data, error } = await supabase.from('jockeys').select('*').eq('id', id).single();
    if (error || !data) {
        if (error && error.code !== 'PGRST116') {
            console.error(`Error fetching jockey with id ${id}:`, error);
        }
        return null;
    }
    const wins = data.wins || 0;
    const mounts = data.mounts || 0;
    const winRate = mounts > 0 ? ((wins / mounts) * 100).toFixed(1) + '%' : '0%';
     return {
        id: data.id,
        name: data.name,
        imageUrl: data.image_url,
        wins: wins,
        mounts: mounts,
        winRate: winRate
    };
}

export async function getTrainer(id: number): Promise<Trainer | null> {
    const supabase = createServerClient();
    const { data, error } = await supabase.from('trainers').select('*').eq('id', id).single();
    if (error || !data) {
        if (error && error.code !== 'PGRST116') {
            console.error(`Error fetching trainer with id ${id}:`, error);
        }
        return null;
    }
     return {
        id: data.id,
        name: data.name,
        image_url: data.image_url,
        achievements: Array.isArray(data.achievements) ? data.achievements : (typeof data.achievements === 'string' ? data.achievements.split(',').map((s: string) => s.trim()) : []),
        stats: {
            wins: data.wins || 0,
            mounts: data.mounts || 0,
        }
    };
}

export async function getHorse(id: number): Promise<Horse | null> {
    const supabase = createServerClient();
    const { data, error } = await supabase.from('horses').select('*').eq('id', id).single();
    if (error || !data) {
        if (error && error.code !== 'PGRST116') {
            console.error(`Error fetching horse with id ${id}:`, error);
        }
        return null;
    }
    return data;
}


export async function getRaceEvent(id: number): Promise<RaceEvent | null> {
    const supabase = createServerClient();
    const { data, error } = await supabase.from('race_events').select('*, races (*)').eq('id', id).single();
    if (error || !data) {
        if (error && error.code !== 'PGRST116') {
            console.error(`Error fetching race event with id ${id}:`, error);
        }
        return null;
    }
    
    if (data.races) {
        data.races.sort((a: any, b: any) => a.time.localeCompare(b.time));
    }

    return data as RaceEvent;
}

export async function getNewsPosts(): Promise<Omit<NewsPost, 'comments' | 'content'>[]> {
    const supabase = createServerClient();
    try {
        const { data, error } = await supabase.from('news_posts').select('id, title, date, category, excerpt, image_url, href, views, likes').order('date', { ascending: false });
        if (error) {
            console.error('Error fetching news posts:', error.message);
            return [];
        }
        return (data || []).map(post => ({
            ...post,
            href: `/news/${post.id}`,
        }));
    } catch(e: any) {
        console.error('Error fetching news posts:', e.message);
        return [];
    }
}

export async function getNewsPost(id: string): Promise<NewsPost | null> {
    const supabase = createServerClient();
    // This RPC call should only be done on client to not increment view count for server renders
    // const { error: incrementError } = await supabase.rpc('increment_views', { post_id_arg: parseInt(id, 10) });
    // if (incrementError) {
    //     console.error(`Error incrementing view count for post ${id}:`, incrementError);
    // }
    
    const { data, error } = await supabase
        .from('news_posts')
        .select(`
            *,
            comments (
                *,
                profiles ( id, full_name, username, avatar_url )
            )
        `)
        .eq('id', id)
        .order('created_at', { foreignTable: 'comments', ascending: false })
        .single();
    
    if (error || !data) {
        if (error && error.code !== 'PGRST116') {
            console.error(`Error fetching news post with id ${id}:`, error);
        }
        return null;
    }

    return {
      ...data,
      href: `/news/${data.id}`,
      comments: (data.comments as Comment[]) || [],
    };
}


export async function getResult(id: number): Promise<Result | null> {
    const supabase = createServerClient();
    const { data, error } = await supabase.from('results').select('*').eq('id', id).single();
    if (error || !data) {
        if (error && error.code !== 'PGRST116') {
            console.error(`Error fetching result with id ${id}:`, error);
        }
        return null;
    }
    return data;
}

export async function getPartner(id: number): Promise<Partner | null> {
    const supabase = createServerClient();
    const { data, error } = await supabase.from('partners').select('*').eq('id', id).single();
    if (error || !data) {
        if (error && error.code !== 'PGRST116') {
            console.error(`Error fetching partner with id ${id}:`, error);
        }
        return null;
    }
    return data;
}

export async function getSiteContent(key: string): Promise<string> {
    const supabase = createServerClient();
    try {
        const { data, error } = await supabase
            .from('site_content')
            .select('content')
            .eq('key', key)
            .single();

        if (error || !data) {
            if (error && error.code !== 'PGRST116') { // 'PGRST116' means no rows found
                console.error(`Error fetching site content for key "${key}":`, error.message);
            }
            return '';
        }
        return data.content || '';
    } catch (e: any) {
        console.error(`Error in getSiteContent for key "${key}":`, e.message);
        return '';
    }
}

