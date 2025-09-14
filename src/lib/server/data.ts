





import 'server-only';

import type { Jockey, Trainer, Horse, RaceEvent, Result, Partner, NewsPost, UserProfile, Stats, Track, Owner } from '@/lib/types';
import { createServerClient } from '../supabase/server';
import { cookies } from 'next/headers';


export async function getDashboardStats(): Promise<Stats> {
    const supabase = createServerClient();
    try {
        const [
            { count: horses },
            { count: jockeys },
            { count: trainers },
            { count: news },
            { count: events },
        ] = await Promise.all([
            supabase.from('horses').select('*', { count: 'exact', head: true }),
            supabase.from('jockeys').select('*', { count: 'exact', head: true }),
            supabase.from('trainers').select('*', { count: 'exact', head: true }),
            supabase.from('news_posts').select('*', { count: 'exact', head: true }),
            supabase.from('race_events').select('*', { count: 'exact', head: true }),
        ]);

        return {
            horses: horses ?? 0,
            jockeys: jockeys ?? 0,
            trainers: trainers ?? 0,
            news: news ?? 0,
            events: events ?? 0,
        }
    } catch (error: any) {
        console.error('Error fetching dashboard stats:', error.message);
        // Return zeroed stats on error to prevent breaking the dashboard
        return {
            horses: 0,
            jockeys: 0,
            trainers: 0,
            news: 0,
            events: 0,
        };
    }
}

export async function getUserProfiles(): Promise<UserProfile[]> {
    const supabase = createServerClient();
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('reg_date', { ascending: false });

    if (error) {
        console.error('Error fetching user profiles:', error.message);
        throw new Error(`Failed to fetch user profiles: ${error.message}`);
    }
    
    if (!data) {
        return [];
    }
    
    return data.map(profile => ({
        id: profile.id,
        email: profile.email ?? null,
        reg_date: profile.reg_date ?? new Date().toISOString(),
        role: profile.role ?? 'user',
        full_name: profile.full_name ?? null,
        username: profile.username ?? null,
        avatar_url: profile.avatar_url ?? null,
        deletion_requested: profile.deletion_requested ?? false,
        phone: profile.phone ?? null,
    }));
}


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

export async function getNewsPosts(): Promise<NewsPost[]> {
    const supabase = createServerClient();
    try {
        const { data, error } = await supabase.from('news_posts').select('*').order('date', { ascending: false });
        if (error) {
            console.error('Error fetching news posts:', error.message);
            return [];
        }
        return (data || []).map(post => ({
            ...post,
            href: `/news/${post.id}`,
            comments: [], // Comments are not fetched in list view
        }));
    } catch(e: any) {
        console.error('Error fetching news posts:', e.message);
        return [];
    }
}

export async function getNewsPost(id: string): Promise<NewsPost | null> {
    const supabase = createServerClient();
    
    const { data, error } = await supabase
        .from('news_posts')
        .select('*')
        .eq('id', id)
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
      comments: [],
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

export async function getSiteContent(key: string, lang?: 'bg' | 'en'): Promise<string> {
    const supabase = createServerClient();
    
    let keyToFetch = key;
    if (lang) {
        keyToFetch = `${key}_${lang}`;
    }

    try {
        const { data, error } = await supabase
            .from('site_content')
            .select('content')
            .eq('key', keyToFetch)
            .single();

        if (error || !data) {
            // 'PGRST116' means no rows found, which is an expected case.
            if (error && error.code !== 'PGRST116') { 
                console.error(`Error fetching site content for key "${keyToFetch}":`, error.message);
            }
             // If not found, try the base key (for backwards compatibility with old keys)
            if (lang) {
                 const { data: baseData, error: baseError } = await supabase
                    .from('site_content')
                    .select('content')
                    .eq('key', key)
                    .single();
                if (baseError || !baseData) {
                    if (baseError && baseError.code !== 'PGRST116') {
                        console.error(`Error fetching site content for base key "${key}":`, baseError.message);
                    }
                    return '';
                }
                return baseData.content || '';
            }
            return '';
        }
        return data.content || '';
    } catch (e: any) {
        console.error(`Error in getSiteContent for key "${keyToFetch}":`, e.message);
        return '';
    }
}

export async function getTrack(id: number): Promise<Track | null> {
    const supabase = createServerClient();
    const { data, error } = await supabase.from('tracks').select('*').eq('id', id).single();
    if (error || !data) {
        if (error && error.code !== 'PGRST116') {
            console.error(`Error fetching track with id ${id}:`, error);
        }
        return null;
    }
    return data;
}

export async function getOwner(id: number): Promise<Owner | null> {
    const supabase = createServerClient();
    const { data, error } = await supabase.from('owners').select('*').eq('id', id).single();
    if (error || !data) {
        if (error && error.code !== 'PGRST116') {
            console.error(`Error fetching owner with id ${id}:`, error);
        }
        return null;
    }
    return data;
}
