
import type { Jockey, Trainer, Horse, Track, NewsPost, RaceEvent, Document } from '@/lib/types';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and anonymous key are required. Please set them in your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getJockeys(): Promise<Jockey[]> {
    const { data, error } = await supabase.from('jockeys').select('*').order('name', { ascending: true });
    if (error) {
        console.error('Error fetching jockeys:', error);
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
    const { data, error } = await supabase.from('trainers').select('*').order('name', { ascending: true });
    if (error) {
        console.error('Error fetching trainers:', error);
        return [];
    }
    return (data || []).map(trainer => ({
        ...trainer,
        // Convert comma-separated strings to arrays
        achievements: trainer.achievements ? trainer.achievements.split(',').map((s: string) => s.trim()) : [],
        associatedHorses: trainer.associatedHorses ? trainer.associatedHorses.split(',').map((s: string) => s.trim()) : [],
    }));
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
        // Convert comma-separated strings to arrays
        achievements: data.achievements ? data.achievements.split(',').map((s: string) => s.trim()) : [],
        associatedHorses: data.associatedHorses ? data.associatedHorses.split(',').map((s: string) => s.trim()) : [],
    };
}


export const horses: Horse[] = [
  { id: 1, name: 'Вятър', sire: 'Ураган', dam: 'Бриза', age: 4, owner: 'Конюшня "Надежда"', pastResults: [{ date: '2023-10-15', track: 'Хиподрум Банкя', position: 1 }] },
  { id: 2, name: 'Мълния', sire: 'Гръм', dam: 'Светкавица', age: 3, owner: 'Конюшня "Слава"', pastResults: [{ date: '2023-09-20', track: 'Хиподрум Шумен', position: 1 }] },
  { id: 3, name: 'Звезда', sire: 'Галактион', dam: 'Полярна', age: 5, owner: 'Мария Георгиева', pastResults: [{ date: '2023-11-01', track: 'Хиподрум София', position: 2 }] },
  { id: 4, name: 'Титан', sire: 'Атлас', dam: 'Гея', age: 4, owner: 'Георги Павлов', pastResults: [{ date: '2023-10-25', track: 'Хиподрум Пловдив', position: 1 }] },
  { id: 5, name: 'Буря', sire: 'Вихър', dam: 'Хала', age: 3, owner: 'Конюшня "Надежда"', pastResults: [{ date: '2024-03-10', track: 'Хиподрум Банкя', position: 3 }] },
  { id: 6, name: 'Торнадо', sire: 'Циклон', dam: 'Тайфун', age: 4, owner: 'Конюшня "Слава"', pastResults: [{ date: '2024-04-05', track: 'Хиподрум Шумен', position: 2 }] },
];

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
    const { data: events, error: eventsError } = await supabase
        .from('race_events')
        .select(`
            *,
            races (*)
        `)
        .order('date', { ascending: true });

    if (eventsError) {
        console.error('Error fetching race events:', eventsError);
        return [];
    }
    
    // Sort races by time for each event
    for (const event of events) {
        if (event.races) {
            event.races.sort((a, b) => a.time.localeCompare(b.time));
        }
    }

    return events as RaceEvent[];
}


export async function getNewsPosts(): Promise<NewsPost[]> {
    const { data, error } = await supabase.from('news_posts').select('*').order('date', { ascending: false });
    if (error) {
        console.error('Error fetching news posts:', error);
        return [];
    }
    return (data || []).map(post => ({
        ...post,
        href: `/news/${post.id}`,
    }));
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
    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });
        
    if (error) {
        console.error('Error fetching documents:', error);
        return [];
    }

    return data.map(doc => {
        const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(doc.path);
        return {
            ...doc,
            href: publicUrl,
        }
    });
}
