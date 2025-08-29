

import type { Jockey, Trainer, Horse, Track, NewsPost, RaceEvent, Document, Result, Partner, SiteContent, Comment, Submission } from '@/lib/types';
import { createServerClient } from './supabase/server';
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and anonymous key are required. Please set them in your .env file.');
}

// Universal client that can be used on server and client
const supabase = createClient(supabaseUrl, supabaseAnonKey)


export async function getJockeys(): Promise<Jockey[]> {
    try {
        const { data, error } = await supabase.from('jockeys').select('id, name, wins, mounts, image_url').order('name', { ascending: true });
        if (error) {
            console.error('Error fetching jockeys:', error.message);
            return [];
        }
        return (data || []).map(jockey => {
            const wins = jockey.wins || 0;
            const mounts = jockey.mounts || 0;
            const winRate = mounts > 0 ? ((wins / mounts) * 100).toFixed(1) + '%' : '0%';
            return {
                id: jockey.id,
                name: jockey.name,
                imageUrl: jockey.image_url,
                wins: wins,
                mounts: mounts,
                winRate: winRate,
            }
        });
    } catch (error: any) {
        console.error('Error in getJockeys:', error.message);
        return [];
    }
}

export async function getJockey(id: number): Promise<Jockey | null> {
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

export async function getTrainers(): Promise<Trainer[]> {
    try {
        const { data, error } = await supabase.from('trainers').select('*').order('name', { ascending: true });
        if (error) {
            console.error('Error fetching trainers:', error.message);
            return [];
        }
        return (data || []).map(trainer => ({
            id: trainer.id,
            name: trainer.name,
            image_url: trainer.image_url,
            achievements: Array.isArray(trainer.achievements) ? trainer.achievements : (typeof trainer.achievements === 'string' ? trainer.achievements.split(',').map((s: string) => s.trim()) : []),
            stats: {
                wins: trainer.wins || 0,
                mounts: trainer.mounts || 0,
            }
        }));
    } catch (error: any) {
        console.error('Error in getTrainers:', error.message);
        return [];
    }
}


export async function getTrainer(id: number): Promise<Trainer | null> {
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


export async function getHorses(): Promise<Horse[]> {
    try {
        const { data, error } = await supabase.from('horses').select('*').order('name', { ascending: true });
        if (error) {
            console.error('Error fetching horses:', error.message);
            return [];
        }
        return data || [];
    } catch(e: any) {
        console.error('Error in getHorses:', e.message);
        return [];
    }
}

export async function getHorse(id: number): Promise<Horse | null> {
    const { data, error } = await supabase.from('horses').select('*').eq('id', id).single();
    if (error || !data) {
        if (error && error.code !== 'PGRST116') {
            console.error(`Error fetching horse with id ${id}:`, error);
        }
        return null;
    }
    return data;
}

export const tracks: Track[] = [
    { id: 1, name: 'Хиподрум "Гецово"', location: 'с. Гецово, обл. Разград', description: '„Хиподрумът в момента е в изоставено състояние, но нашият екип вече работи активно по неговото възстановяване, за да бъде готов за Държавното първенство по конни надбягвания през сезон 2026. Следващата ни цел е да осигурим финансиране и подкрепа от общината за цялостното проектиране и пълно обновяване на съоръжението.“' },
];

// This is now an empty array.
// The gallery page will check this and display a message if it's empty.
export const galleryImages: { id: number; src: string; alt: string, hint: string }[] = [];


export async function getRaceEvents(): Promise<RaceEvent[]> {
    try {
        const { data: events, error: eventsError } = await supabase
            .from('race_events')
            .select(`
                *,
                races (*)
            `)
            .order('date', { ascending: true });

        if (eventsError) {
            console.error('Error fetching race events:', eventsError.message);
            return [];
        }
        
        for (const event of events) {
            if (event.races) {
                event.races.sort((a, b) => a.time.localeCompare(b.time));
            }
        }

        return events as RaceEvent[];
    } catch (e: any) {
        console.error('Error in getRaceEvents:', e.message);
        return [];
    }
}


export async function getRaceEvent(id: number): Promise<RaceEvent | null> {
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
    // We use the admin client here to bypass RLS for the view count increment.
    // This is a simplified approach. In a production environment, you'd want a more robust system
    // to prevent view count manipulation (e.g., tracking IPs or using a dedicated service).
    
    // Using the universal client here
    const { error: incrementError } = await supabase.rpc('increment_views', { post_id_arg: parseInt(id, 10) });
    if (incrementError) {
        console.error(`Error incrementing view count for post ${id}:`, incrementError);
        // We don't stop execution, just log the error.
    }
    
    // Now fetch the post data using the regular server client to respect RLS for data fetching.
    // Using the universal client is also fine here as RLS is enforced on the database level.
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


export async function getDocuments(): Promise<Document[]> {
    try {
        const { data, error } = await supabase
            .from('documents')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) {
            console.error('Error fetching documents:', error.message);
            return [];
        }

        return data.map(doc => {
            const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(doc.path);
            return {
                ...doc,
                href: publicUrl,
            }
        });
    } catch (e: any) {
        console.error('Error fetching documents:', e.message);
        return [];
    }
}

export async function getResults(): Promise<Result[]> {
    try {
        const { data, error } = await supabase.from('results').select('*').order('date', { ascending: false });
        if (error) {
            console.error('Error fetching results:', error.message);
            return [];
        }
        return data || [];
    } catch(e: any) {
        console.error('Error fetching results:', e.message);
        return [];
    }
}

export async function getResult(id: number): Promise<Result | null> {
    const { data, error } = await supabase.from('results').select('*').eq('id', id).single();
    if (error || !data) {
        if (error && error.code !== 'PGRST116') {
            console.error(`Error fetching result with id ${id}:`, error);
        }
        return null;
    }
    return data;
}

export async function getPartners(): Promise<Partner[]> {
    try {
        const { data, error } = await supabase.from('partners').select('*').order('created_at', { ascending: true });
        if (error) {
            console.error('Error fetching partners:', error.message);
            return [];
        }
        return data || [];
    } catch(e: any) {
        console.error('Error fetching partners:', e.message);
        return [];
    }
}

export async function getPartner(id: number): Promise<Partner | null> {
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

export async function getCommentsForPost(postId: number): Promise<Comment[]> {
    const { data, error } = await supabase
        .from('comments')
        .select(`
            *,
            profiles ( id, full_name, username, avatar_url )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error(`Error fetching comments for post ${postId}:`, error);
        return [];
    }
    return data;
}

export async function getSubmissions(): Promise<Submission[]> {
    const supabase = createServerClient();
    const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching submissions:", error);
        return [];
    }
    return data;
}

