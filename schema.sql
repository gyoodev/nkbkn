-- Create news_posts table
CREATE TABLE news_posts (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title TEXT NOT NULL,
    date DATE NOT NULL,
    category TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT NOT NULL,
    href TEXT NOT NULL,
    views INT NOT NULL,
    likes INT NOT NULL,
    comments_count INT NOT NULL
);

-- Create jockeys table
CREATE TABLE jockeys (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    stats JSONB NOT NULL,
    image_url TEXT NOT NULL
);

-- Create trainers table
CREATE TABLE trainers (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    achievements TEXT[] NOT NULL,
    associated_horses TEXT[] NOT NULL,
    image_url TEXT NOT NULL
);

-- Create horses table
CREATE TABLE horses (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    sire TEXT NOT NULL,
    dam TEXT NOT NULL,
    age INT NOT NULL,
    owner TEXT NOT NULL,
    past_results JSONB
);

-- Create tracks table
CREATE TABLE tracks (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL
);

-- Create admin_profiles table
CREATE TABLE admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- Enable Row Level Security (RLS)
ALTER TABLE news_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE jockeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE horses ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Allow public read access for news_posts" ON news_posts FOR SELECT USING (true);
CREATE POLICY "Allow public read access for jockeys" ON jockeys FOR SELECT USING (true);
CREATE POLICY "Allow public read access for trainers" ON trainers FOR SELECT USING (true);
CREATE POLICY "Allow public read access for horses" ON horses FOR SELECT USING (true);
CREATE POLICY "Allow public read access for tracks" ON tracks FOR SELECT USING (true);

-- RLS Policies for admin_profiles
CREATE POLICY "Admins can see all profiles." ON public.admin_profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can insert their own profile." ON public.admin_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can update their own profile." ON public.admin_profiles FOR UPDATE USING (auth.uid() = id);


-- Insert sample data
INSERT INTO news_posts (title, date, category, excerpt, content, image_url, href, views, likes, comments_count) VALUES
('Голямото дерби наближава: Очаквания и фаворити', '2024-08-15', 'Предстоящи', 'С наближаването на най-очакваното събитие в календара, напрежението расте. Кои са конете, които ще се борят за слава?', 'С наближаването на най-очакваното събитие в календара, напрежението расте. Кои са конете, които ще се борят за слава? Всички погледи са насочени към "Вятър", миналогодишния шампион, но "Мълния" показва изключителна форма в последните си тренировки. Треньорите са на нокти, а жокеите подготвят своите стратегии. Очаква се епична битка на хиподрума в Банкя.', 'https://images.unsplash.com/photo-1730982538397-ee793b11fe44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxob3JzZSUyMHJhY2UlMjBmaW5pc2h8ZW58MHx8fHwxNzU2Mjg2MjE4fDA&ixlib=rb-4.1.0&q=80&w=1080', '/news/1', 1250, 24, 7),
('Изненадваща победа на "Буря" в купа "Надежда"', '2024-08-10', 'Резултати', 'Никой не очакваше, но "Буря" с жокей Георги Атанасов прекоси финалната линия първи, оставяйки фаворитите зад себе си.', 'В един драматичен обрат, "Буря", считан за аутсайдер, триумфира в купа "Надежда". Жокей Георги Атанасов направи перфектното яздене, извеждайки коня си до победата в последните метри. "Знаех, че имаме сили, просто чакахме нашия момент," сподели развълнуваният Атанасов след финала.', 'https://images.unsplash.com/photo-1580974582235-4996ef109bbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxqb2NrZXklMjBob3JzZXxlbnwwfHx8fDE3NTYyODYyMTh8MA&ixlib=rb-4.1.0&q=80&w=1080', '/news/2', 980, 18, 4),
('Нови таланти на хоризонта: Младите жокеи на България', '2024-08-05', 'Анализи', 'Разглеждаме кои са новите имена в жокейската професия, които обещават да разтърсят статуквото.', 'Сезон 2024 изглежда ще бъде поле за изява на новото поколение жокеи. Имена като младия Петър Петров и амбициозната Елена Василева вече записаха първите си победи и показват потенциал да се превърнат в звезди. Техният хъс и модерният им подход към състезанията внасят свежа енергия в спорта.', 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxqb2NrZXklMjBob3JzZXxlbnwwfHx8fDE3NTYyODYyMTh8MA&ixlib=rb-4.1.0&q=80&w=1080', '/news/3', 750, 15, 9),
('Хиподрум "Банкя" с нови подобрения за сезона', '2024-07-28', 'Новини', 'Ръководството на хиподрума инвестира в нова дренажна система и подобрени трибуни за зрителите.', 'За да посрещне новия състезателен сезон, хиподрум "Банкя" претърпя значителни подобрения. Новата дренажна система на пистата ще осигури оптимални условия за бягане дори при неблагоприятни метеорологични условия. Трибуните също са обновени, за да предложат повече комфорт на верните фенове на конните надбягвания.', 'https://images.unsplash.com/photo-1599493344583-14987041c2a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxob3JzZSUyMHJhY2UlMjB0cmFja3xlbnwwfHx8fDE3NTYyODYyMTh8MA&ixlib=rb-4.1.0&q=80&w=1080', '/news/4', 620, 12, 3);

INSERT INTO jockeys (name, stats, image_url) VALUES
('Георги Атанасов', '{"wins": 120, "mounts": 850, "winRate": "14.1%"}', 'https://picsum.photos/400/400?random=1'),
('Николай Гроздев', '{"wins": 95, "mounts": 720, "winRate": "13.2%"}', 'https://picsum.photos/400/400?random=2'),
('Валентин Атанасов', '{"wins": 88, "mounts": 680, "winRate": "12.9%"}', 'https://picsum.photos/400/400?random=3'),
('Иван Иванов', '{"wins": 76, "mounts": 610, "winRate": "12.5%"}', 'https://picsum.photos/400/400?random=4'),
('Стефан Петров', '{"wins": 65, "mounts": 550, "winRate": "11.8%"}', 'https://picsum.photos/400/400?random=5'),
('Петър Димитров', '{"wins": 59, "mounts": 510, "winRate": "11.6%"}', 'https://picsum.photos/400/400?random=6');

INSERT INTO trainers (name, achievements, associated_horses, image_url) VALUES
('Димитър Димитров', '{"Шампион на България 2022", "Купа на София 2021"}', '{"Вятър", "Буря"}', 'https://picsum.photos/400/400?random=7'),
('Христо Стоянов', '{"Дерби на България 2023", "Най-добър треньор 2023"}', '{"Мълния", "Торнадо"}', 'https://picsum.photos/400/400?random=8'),
('Мария Георгиева', '{"Първа дама треньор шампион", "Награда за иновации 2022"}', '{"Звезда", "Комета"}', 'https://picsum.photos/400/400?random=9'),
('Георги Павлов', '{"Двукратен шампион на Пловдив", "Рекордьор за най-много победи в сезон"}', '{"Титан", "Херкулес"}', 'https://picsum.photos/400/400?random=10');

INSERT INTO horses (name, sire, dam, age, owner, past_results) VALUES
('Вятър', 'Ураган', 'Бриза', 4, 'Конюшня "Надежда"', '[{"date": "2023-10-15", "track": "Хиподрум Банкя", "position": 1}]'),
('Мълния', 'Гръм', 'Светкавица', 3, 'Конюшня "Слава"', '[{"date": "2023-09-20", "track": "Хиподрум Шумен", "position": 1}]'),
('Звезда', 'Галактион', 'Полярна', 5, 'Мария Георгиева', '[{"date": "2023-11-01", "track": "Хиподрум София", "position": 2}]'),
('Титан', 'Атлас', 'Гея', 4, 'Георги Павлов', '[{"date": "2023-10-25", "track": "Хиподрум Пловдив", "position": 1}]'),
('Буря', 'Вихър', 'Хала', 3, 'Конюшня "Надежда"', '[{"date": "2024-03-10", "track": "Хиподрум Банкя", "position": 3}]'),
('Торнадо', 'Циклон', 'Тайфун', 4, 'Конюшня "Слава"', '[{"date": "2024-04-05", "track": "Хиподрум Шумен", "position": 2}]');

INSERT INTO tracks (name, location, description) VALUES
('Хиподрум Банкя', 'гр. Банкя, обл. София', 'Най-големият и модерен хиподрум в България, домакин на националното дерби.'),
('Хиподрум Шумен', 'гр. Шумен', 'Исторически хиподрум с богати традиции в конните надбягвания.'),
('Хиподрум Пловдив', 'гр. Пловдив', 'Разположен в сърцето на Тракия, известен с бързата си писта.'),
('Хиподрум Русе', 'гр. Русе', 'Живописен хиподрум на брега на река Дунав.');
