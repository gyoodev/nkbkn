-- -------------------------------------------------
-- 1. Create tables
-- -------------------------------------------------

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username    TEXT UNIQUE,
    full_name   TEXT,
    avatar_url  TEXT,
    website     TEXT,
    role        TEXT DEFAULT 'user',
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- News Posts table
CREATE TABLE IF NOT EXISTS public.news_posts (
    id            BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title         TEXT    NOT NULL,
    "date"        DATE    NOT NULL,
    category      TEXT    NOT NULL,
    excerpt       TEXT    NOT NULL,
    content       TEXT    NOT NULL,
    image_url     TEXT    NOT NULL,
    href          TEXT    NOT NULL,
    views         INT     NOT NULL,
    likes         INT     NOT NULL,
    comments_count INT    NOT NULL
);

-- Jockeys table
CREATE TABLE IF NOT EXISTS public.jockeys (
    id        BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name      TEXT    NOT NULL,
    stats     JSONB   NOT NULL,
    image_url TEXT    NOT NULL
);

-- Trainers table
CREATE TABLE IF NOT EXISTS public.trainers (
    id                BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name              TEXT    NOT NULL,
    achievements      TEXT[]  NOT NULL,
    associated_horses TEXT[]  NOT NULL,
    image_url         TEXT    NOT NULL
);

-- Horses table
CREATE TABLE IF NOT EXISTS public.horses (
    id          BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name        TEXT    NOT NULL,
    sire        TEXT    NOT NULL,
    dam         TEXT    NOT NULL,
    age         INT     NOT NULL,
    owner       TEXT    NOT NULL,
    past_results JSONB
);

-- Tracks table
CREATE TABLE IF NOT EXISTS public.tracks (
    id          BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name        TEXT    NOT NULL,
    location    TEXT    NOT NULL,
    description TEXT    NOT NULL
);


-- -------------------------------------------------
-- 2. Row Level Security (RLS)
-- -------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jockeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Policies for public read access
CREATE POLICY "Public read access for news_posts" ON public.news_posts FOR SELECT USING (true);
CREATE POLICY "Public read access for jockeys" ON public.jockeys FOR SELECT USING (true);
CREATE POLICY "Public read access for trainers" ON public.trainers FOR SELECT USING (true);
CREATE POLICY "Public read access for horses" ON public.horses FOR SELECT USING (true);
CREATE POLICY "Public read access for tracks" ON public.tracks FOR SELECT USING (true);


-- -------------------------------------------------
-- 3. Functions & Triggers
-- -------------------------------------------------

-- Function to create a profile for a new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- -------------------------------------------------
-- 4. Sample Data
-- -------------------------------------------------
INSERT INTO public.news_posts (id, title, "date", category, excerpt, content, image_url, href, views, likes, comments_count)
VALUES
(1, 'Голямото дерби наближава: Очаквания и фаворити','2024-08-15','Предстоящи', 'С наближаването на най-очакваното събитие в календара, напрежението расте. Кои са конете, които ще се борят за слава?', 'С наближаването на най-очакваното събитие в календара, напрежението расте. Кои са конете, които ще се борят за слава? Всички погледи са насочени към "Вятър", миналогодишния шампион, но "Мълния" показва изключителна форма в последните си тренировки. Треньорите са на нокти, а жокеите подготвят своите стратегии. Очаква се епична битка на хиподрума в Банкя.', 'https://images.unsplash.com/photo-1730982538397-ee793b11fe44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxob3JzZSUyMHJhY2UlMjBmaW5pc2h8ZW58MHx8fHwxNzU2Mjg2MjE4fDA&ixlib=rb-4.1.0&q=80&w=1080', '/news/1',1250,24,7),
(2, 'Изненадваща победа на "Буря" в купа "Надежда"', '2024-08-10', 'Резултати', 'Никой не очакваше, но "Буря" с жокей Георги Атанасов прекоси финалната линия първи, оставяйки фаворитите зад себе си.', 'В един драматичен обрат, "Буря", считан за аутсайдер, триумфира в купа "Надежда". Жокей Георги Атанасов направи перфектното яздене, извеждайки коня си до победата в последните метри. "Знаех, че имаме сили, просто чакахме нашия момент," сподели развълнуваният Атанасов след финала.', 'https://images.unsplash.com/photo-1580974582235-4996ef109bbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxqb2NrZXklMjBob3JzZXxlbnwwfHx8fDE3NTYyODYyMTh8MA&ixlib=rb-4.1.0&q=80&w=1080', '/news/2', 980, 18, 4),
(3, 'Нови таланти на хоризонта: Младите жокеи на България', '2024-08-05', 'Анализи', 'Разглеждаме кои са новите имена в жокейската професия, които обещават да разтърсят статуквото.', 'Сезон 2024 изглежда ще бъде поле за изява на новото поколение жокеи. Имена като младия Петър Петров и амбициозната Елена Василева вече записаха първите си победи и показват потенциал да се превърнат в звезди. Техният хъс и модерният им подход към състезанията внасят свежа енергия в спорта.', 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxqb2NrZXklMjBob3JzZXxlbnwwfHx8fDE3NTYyODYyMTh8MA&ixlib=rb-4.1.0&q=80&w=1080', '/news/3', 750, 15, 9),
(4, 'Хиподрум "Банкя" с нови подобрения за сезона', '2024-07-28', 'Новини', 'Ръководството на хиподрума инвестира в нова дренажна система и подобрени трибуни за зрителите.', 'За да посрещне новия състезателен сезон, хиподрум "Банкя" претърпя значителни подобрения. Новата дренажна система на пистата ще осигури оптимални условия за бягане дори при неблагоприятни метеорологични условия. Трибуните също са обновени, за да предложат повече комфорт на верните фенове на конните надбягвания.', 'https://images.unsplash.com/photo-1599493344583-14987041c2a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxob3JzZSUyMHJhY2UlMjB0cmFja3xlbnwwfHx8fDE3NTYyODYyMTh8MA&ixlib=rb-4.1.0&q=80&w=1080', '/news/4', 620, 12, 3),
(5,'Голямото дерби наближава: Очаквания и фаворити','2024-08-15','Предстоящи', 'С наближаването на най-очакваното събитие в календара, напрежението расте. Кои са конете, които ще се борят за слава?', 'С наближаването на най-очакваното събитие...', 'https://images.unsplash.com/photo-1730982538397-ee793b11fe44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxob3JzZSUyMHJhY2UlMjBmaW5pc2h8ZW58MHx8fHwxNzU2Mjg2MjE4fDA&ixlib=rb-4.1.0&q=80&w=1080', '/news/5',1250,24,7)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.jockeys (id, name, stats, image_url)
VALUES
(1, 'Георги Атанасов', '{"wins": 120, "mounts": 850, "winRate": "14.1%"}', 'https://picsum.photos/400/400?random=1'),
(2, 'Николай Гроздев', '{"wins": 95, "mounts": 720, "winRate": "13.2%"}', 'https://picsum.photos/400/400?random=2'),
(3, 'Валентин Атанасов', '{"wins": 88, "mounts": 680, "winRate": "12.9%"}', 'https://picsum.photos/400/400?random=3'),
(4, 'Иван Иванов', '{"wins": 76, "mounts": 610, "winRate": "12.5%"}', 'https://picsum.photos/400/400?random=4'),
(5, 'Стефан Петров', '{"wins": 65, "mounts": 550, "winRate": "11.8%"}', 'https://picsum.photos/400/400?random=5'),
(6, 'Петър Димитров', '{"wins": 59, "mounts": 510, "winRate": "11.6%"}', 'https://picsum.photos/400/400?random=6')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.trainers (id, name, achievements, associated_horses, image_url)
VALUES
(1, 'Димитър Димитров', '{"Шампион на България 2022", "Купа на София 2021"}', '{"Вятър", "Буря"}', 'https://picsum.photos/400/400?random=7'),
(2, 'Христо Стоянов', '{"Дерби на България 2023", "Най-добър треньор 2023"}', '{"Мълния", "Торнадо"}', 'https://picsum.photos/400/400?random=8'),
(3, 'Мария Георгиева', '{"Първа дама треньор шампион", "Награда за иновации 2022"}', '{"Звезда", "Комета"}', 'https://picsum.photos/400/400?random=9'),
(4, 'Георги Павлов', '{"Двукратен шампион на Пловдив", "Рекордьор за най-много победи в сезон"}', '{"Титан", "Херкулес"}', 'https://picsum.photos/400/400?random=10')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.horses (id, name, sire, dam, age, owner, past_results)
VALUES
(1, 'Вятър', 'Ураган', 'Бриза', 4, 'Конюшня "Надежда"', '[{"date": "2023-10-15", "track": "Хиподрум Банкя", "position": 1}]'),
(2, 'Мълния', 'Гръм', 'Светкавица', 3, 'Конюшня "Слава"', '[{"date": "2023-09-20", "track": "Хиподрум Шумен", "position": 1}]'),
(3, 'Звезда', 'Галактион', 'Полярна', 5, 'Мария Георгиева', '[{"date": "2023-11-01", "track": "Хиподрум София", "position": 2}]'),
(4, 'Титан', 'Атлас', 'Гея', 4, 'Георги Павлов', '[{"date": "2023-10-25", "track": "Хиподрум Пловдив", "position": 1}]'),
(5, 'Буря', 'Вихър', 'Хала', 3, 'Конюшня "Надежда"', '[{"date": "2024-03-10", "track": "Хиподрум Банкя", "position": 3}]'),
(6, 'Торнадо', 'Циклон', 'Тайфун', 4, 'Конюшня "Слава"', '[{"date": "2024-04-05", "track": "Хиподрум Шумен", "position": 2}]')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.tracks (id, name, location, description)
VALUES
(1, 'Хиподрум Банкя', 'гр. Банкя, обл. София', 'Най-големият и модерен хиподрум в България, домакин на националното дерби.'),
(2, 'Хиподрум Шумен', 'гр. Шумен', 'Исторически хиподрум с богати традиции в конните надбягвания.'),
(3, 'Хиподрум Пловдив', 'гр. Пловдив', 'Разположен в сърцето на Тракия, известен с бързата си писта.'),
(4, 'Хиподрум Русе', 'гр. Русе', 'Живописен хиподрум на брега на река Дунав.')
ON CONFLICT (id) DO NOTHING;

    