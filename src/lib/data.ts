
import type { Jockey, Trainer, Horse, Track, NewsPost, RaceEvent, Document, Result } from '@/lib/types';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and anonymous key are required. Please set them in your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getJockeys(): Promise<Jockey[]> {
    try {
        const { data, error } = await supabase.from('jockeys').select('*').order('name', { ascending: true });
        if (error) {
            console.error('Error fetching jockeys:', error.message);
            return [];
        }
        return (data || []).map(jockey => ({
            ...jockey,
            stats: {
                wins: jockey.wins,
                mounts: jockey.mounts,
                winRate: jockey.mounts > 0 ? `${((jockey.wins / jockey.mounts) * 100).toFixed(1)}%` : '0%'
            }
        }));
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
     return {
        ...data,
        stats: {
            wins: data.wins,
            mounts: data.mounts,
            winRate: data.mounts > 0 ? `${((data.wins / data.mounts) * 100).toFixed(1)}%` : '0%'
        }
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
            ...trainer,
            achievements: Array.isArray(trainer.achievements) ? trainer.achievements : (typeof trainer.achievements === 'string' ? trainer.achievements.split(',').map((s: string) => s.trim()) : []),
            associatedHorses: Array.isArray(trainer.associatedHorses) ? trainer.associatedHorses : (typeof trainer.associatedHorses === 'string' ? trainer.associatedHorses.split(',').map((s: string) => s.trim()) : []),
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
        ...data,
        achievements: Array.isArray(data.achievements) ? data.achievements : (typeof data.achievements === 'string' ? data.achievements.split(',').map((s: string) => s.trim()) : []),
        associatedHorses: Array.isArray(data.associatedHorses) ? data.associatedHorses : (typeof data.associatedHorses === 'string' ? data.associatedHorses.split(',').map((s: string) => s.trim()) : []),
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
    { id: 1, name: 'Хиподрум Банкя', location: 'гр. Банкя, обл. София', description: 'Най-големият и модерен хиподрум в България, домакин на националното дерби.' },
    { id: 2, name: 'Хиподрум Шумен', location: 'гр. Шумен', description: 'Исторически хиподрум с богати традиции в конните надбягвания.' },
    { id: 3, name: 'Хиподрум Пловдив', location: 'гр. Пловдив', description: 'Разположен в сърцето на Тракия, известен с бързата си писта.' },
    { id: 4, name: 'Хиподрум Русе', location: 'гр. Русе', description: 'Живописен хиподрум на брега на река Дунав.' },
];

export const galleryImages: { id: number; src: string; alt: string, hint: string }[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  src: `https://picsum.photos/600/400?random=${20 + i}`,
  alt: `Race image ${i + 1}`,
  hint: 'horse race',
}));

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


export async function getNewsPosts(): Promise<NewsPost[]> {
    try {
        const { data, error } = await supabase.from('news_posts').select('*').order('date', { ascending: false });
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
    const { data, error } = await supabase.from('news_posts').select('*').eq('id', id).single();
    
    if (error || !data) {
        if (error && error.code !== 'PGRST116') {
            console.error(`Error fetching news post with id ${id}:`, error);
        }
        return null;
    }

    return {
      ...data,
      href: `/news/${data.id}`,
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
