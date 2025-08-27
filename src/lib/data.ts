import type { Jockey, Trainer, Horse, Track, NewsPost } from '@/lib/types';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and anonymous key are required. Please set them in your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const jockeys: Jockey[] = [
  { id: 1, name: 'Георги Атанасов', stats: { wins: 120, mounts: 850, winRate: '14.1%' }, imageUrl: 'https://picsum.photos/400/400?random=1' },
  { id: 2, name: 'Николай Гроздев', stats: { wins: 95, mounts: 720, winRate: '13.2%' }, imageUrl: 'https://picsum.photos/400/400?random=2' },
  { id: 3, name: 'Валентин Атанасов', stats: { wins: 88, mounts: 680, winRate: '12.9%' }, imageUrl: 'https://picsum.photos/400/400?random=3' },
  { id: 4, name: 'Иван Иванов', stats: { wins: 76, mounts: 610, winRate: '12.5%' }, imageUrl: 'https://picsum.photos/400/400?random=4' },
  { id: 5, name: 'Стефан Петров', stats: { wins: 65, mounts: 550, winRate: '11.8%' }, imageUrl: 'https://picsum.photos/400/400?random=5' },
  { id: 6, name: 'Петър Димитров', stats: { wins: 59, mounts: 510, winRate: '11.6%' }, imageUrl: 'https://picsum.photos/400/400?random=6' },
];

export const trainers: Trainer[] = [
  { id: 1, name: 'Димитър Димитров', achievements: ['Шампион на България 2022', 'Купа на София 2021'], associatedHorses: ['Вятър', 'Буря'], imageUrl: 'https://picsum.photos/400/400?random=7' },
  { id: 2, name: 'Христо Стоянов', achievements: ['Дерби на България 2023', 'Най-добър треньор 2023'], associatedHorses: ['Мълния', 'Торнадо'], imageUrl: 'https://picsum.photos/400/400?random=8' },
  { id: 3, name: 'Мария Георгиева', achievements: ['Първа дама треньор шампион', 'Награда за иновации 2022'], associatedHorses: ['Звезда', 'Комета'], imageUrl: 'https://picsum.photos/400/400?random=9' },
  { id: 4, name: 'Георги Павлов', achievements: ['Двукратен шампион на Пловдив', 'Рекордьор за най-много победи в сезон'], associatedHorses: ['Титан', 'Херкулес'], imageUrl: 'https://picsum.photos/400/400?random=10' },
];

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
