import type { Jockey, Trainer, Horse, Track, NewsPost } from '@/lib/types';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// The data for jockeys, trainers, horses, and tracks is still static.
// It can be migrated to MongoDB following the pattern for news posts.
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

// This is the static fallback data for news posts.
export const newsPosts: NewsPost[] = [
    { id: 1, title: 'Голямото дерби наближава: Очаквания и фаворити', date: '2024-08-15', category: 'Предстоящи', excerpt: 'С наближаването на най-очакваното събитие в календара, напрежението расте. Кои са конете, които ще се борят за слава?', content: 'С наближаването на най-очакваното събитие в календара, напрежението расте. Кои са конете, които ще се борят за слава? Всички погледи са насочени към "Вятър", миналогодишния шампион, но "Мълния" показва изключителна форма в последните си тренировки. Треньорите са на нокти, а жокеите подготвят своите стратегии. Очаква се епична битка на хиподрума в Банкя.', image_url: 'https://images.unsplash.com/photo-1730982538397-ee793b11fe44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxob3JzZSUyMHJhY2UlMjBmaW5pc2h8ZW58MHx8fHwxNzU2Mjg2MjE4fDA&ixlib=rb-4.1.0&q=80&w=1080', href: '/news/1', views: 1250, likes: 24, comments_count: 7 },
    { id: 2, title: 'Изненадваща победа на "Буря" в купа "Надежда"', date: '2024-08-10', category: 'Резултати', excerpt: 'Никой не очакваше, но "Буря" с жокей Георги Атанасов прекоси финалната линия първи, оставяйки фаворитите зад себе си.', content: 'В един драматичен обрат, "Буря", считан за аутсайдер, триумфира в купа "Надежда". Жокей Георги Атанасов направи перфектното яздене, извеждайки коня си до победата в последните метри. "Знаех, че имаме сили, просто чакахме нашия момент," сподели развълнуваният Атанасов след финала.', image_url: 'https://images.unsplash.com/photo-1580974582235-4996ef109bbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxqb2NrZXklMjBob3JzZXxlbnwwfHx8fDE3NTYyODYyMTh8MA&ixlib=rb-4.1.0&q=80&w=1080', href: '/news/2', views: 980, likes: 18, comments_count: 4 },
    { id: 3, title: 'Нови таланти на хоризонта: Младите жокеи на България', date: '2024-08-05', category: 'Анализи', excerpt: 'Разглеждаме кои са новите имена в жокейската професия, които обещават да разтърсят статуквото.', content: 'Сезон 2024 изглежда ще бъде поле за изява на новото поколение жокеи. Имена като младия Петър Петров и амбициозната Елена Василева вече записаха първите си победи и показват потенциал да се превърнат в звезди. Техният хъс и модерният им подход към състезанията внасят свежа енергия в спорта.', image_url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxqb2NrZXklMjBob3JzZXxlbnwwfHx8fDE3NTYyODYyMTh8MA&ixlib=rb-4.1.0&q=80&w=1080', href: '/news/3', views: 750, likes: 15, comments_count: 9 },
    { id: 4, title: 'Хиподрум "Банкя" с нови подобрения за сезона', date: '2024-07-28', category: 'Новини', excerpt: 'Ръководството на хиподрума инвестира в нова дренажна система и подобрени трибуни за зрителите.', content: 'За да посрещне новия състезателен сезон, хиподрум "Банкя" претърпя значителни подобрения. Новата дренажна система на пистата ще осигури оптимални условия за бягане дори при неблагоприятни метеорологични условия. Трибуните също са обновени, за да предложат повече комфорт на верните фенове на конните надбягвания.', image_url: 'https://images.unsplash.com/photo-1599493344583-14987041c2a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxob3JzZSUyMHJhY2UlMjB0cmFja3xlbnwwfHx8fDE3NTYyODYyMTh8MA&ixlib=rb-4.1.0&q=80&w=1080', href: '/news/4', views: 620, likes: 12, comments_count: 3 },
];

async function getDb() {
    if (!process.env.MONGODB_URI) {
        return null;
    }
    try {
        const client = await clientPromise;
        return client.db("nkbc"); // Specify your database name here
    } catch (e) {
        // This can happen if the URI is present but incorrect.
        console.error("Error connecting to MongoDB:", e);
        return null;
    }
}

export async function getNewsPosts(): Promise<NewsPost[]> {
    const db = await getDb();
    if (!db) {
        // Fallback to static data if DB is not available
        return newsPosts;
    }

    try {
        const posts = await db
            .collection('news_posts')
            .find({})
            .sort({ date: -1 })
            .toArray();

        // Convert MongoDB _id to string id and map to NewsPost type
        return posts.map(post => ({
            ...post,
            id: post._id.toString(),
            href: `/news/${post._id.toString()}`,
        })) as unknown as NewsPost[];
    } catch (error) {
        console.error('Error fetching news posts from DB:', error);
        // Fallback to static data in case of an error during fetch
        return newsPosts;
    }
}

export async function getNewsPost(id: string): Promise<NewsPost | null> {
    const db = await getDb();
    if (!db) {
         // Fallback to static data if DB is not available
        const post = newsPosts.find(p => p.id.toString() === id);
        return post || null;
    }
    
    try {
        if (!ObjectId.isValid(id)) {
            return null;
        }
       
        const post = await db.collection('news_posts').findOne({ _id: new ObjectId(id) });
        
        if (!post) {
            return null;
        }

        // Convert MongoDB _id to string id
        return {
            ...post,
            id: post._id.toString(),
            href: `/news/${post._id.toString()}`,
        } as unknown as NewsPost;

    } catch (error) {
        console.error(`Error fetching news post with id ${id}:`, error);
        return null;
    }
}
