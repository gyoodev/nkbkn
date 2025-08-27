import type { Jockey, Trainer, Horse, Track, NewsPost, RaceEvent } from '@/lib/types';
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

// Add a new Date() to get the current month and year for realistic-looking dates
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();

export const raceEvents: RaceEvent[] = [
    {
        id: 1,
        date: new Date(currentYear, currentMonth, 5).toISOString().split('T')[0],
        track: 'Хиподрум Банкя',
        races: [
            { time: '14:00', name: 'Откриваща гонка', participants: 8 },
            { time: '14:45', name: 'Купа "Надежда"', participants: 10 },
            { time: '15:30', name: 'Спринт "София"', participants: 7 },
        ],
    },
    {
        id: 2,
        date: new Date(currentYear, currentMonth, 12).toISOString().split('T')[0],
        track: 'Хиподрум Шумен',
        races: [
            { time: '13:30', name: 'Надбягване за 2-годишни', participants: 9 },
            { time: '14:15', name: 'Купа "Мадарски конник"', participants: 11 },
            { time: '15:00', name: 'Дълга дистанция', participants: 6 },
        ],
    },
    {
        id: 3,
        date: new Date(currentYear, currentMonth, 19).toISOString().split('T')[0],
        track: 'Хиподрум Банкя',
        races: [
            { time: '14:00', name: 'Квалификация за Дерби', participants: 12 },
            { time: '14:45', name: 'Състезание за кобили', participants: 8 },
            { time: '15:30', name: 'Гран При на Банкя', participants: 10 },
        ],
    },
     {
        id: 4,
        date: new Date(currentYear, currentMonth, 26).toISOString().split('T')[0],
        track: 'Хиподрум Пловдив',
        races: [
            { time: '13:00', name: 'Купа "Филипополис"', participants: 9 },
            { time: '13:45', name: 'Мемориал "Васил Левски"', participants: 10 },
        ],
    },
];

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
