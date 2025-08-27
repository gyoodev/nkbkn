-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  role text default 'user' check (role in ('user', 'admin')),

  constraint username_length check (char_length(username) >= 3)
);

-- RLS policies for profiles
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Function to handle new user
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

-- Trigger to call handle_new_user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Create news_posts table
CREATE TABLE news_posts (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title TEXT NOT NULL,
    date DATE NOT NULL,
    category TEXT,
    excerpt TEXT,
    content TEXT,
    image_url TEXT,
    href TEXT,
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    comments_count INT DEFAULT 0
);

-- RLS policies for news_posts
ALTER TABLE news_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON news_posts
FOR SELECT
USING (true);

-- Insert data into news_posts
INSERT INTO news_posts (title, date, category, excerpt, content, image_url, href, views, likes, comments_count) VALUES
('Голямото дерби наближава: Очаквания и фаворити', '2024-08-15', 'Предстоящи', 'С наближаването на най-очакваното събитие в календара, напрежението расте. Кои са конете, които ще се борят за слава?', 'С наближаването на най-очакваното събитие в календара, напрежението расте. Кои са конете, които ще се борят за слава? Всички погледи са насочени към "Вятър", миналогодишния шампион, но "Мълния" показва изключителна форма в последните си тренировки. Треньорите са на нокти, а жокеите подготвят своите стратегии. Очаква се епична битка на хиподрума в Банкя.', 'https://images.unsplash.com/photo-1730982538397-ee793b11fe44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxob3JzZSUyMHJhY2UlMjBmaW5pc2h8ZW58MHx8fHwxNzU2Mjg2MjE4fDA&ixlib=rb-4.1.0&q=80&w=1080', '/news/1', 1250, 24, 7),
('Изненадваща победа на "Буря" в купа "Надежда"', '2024-08-10', 'Резултати', 'Никой не очакваше, но "Буря" с жокей Георги Атанасов прекоси финалната линия първи, оставяйки фаворитите зад себе си.', 'В един драматичен обрат, "Буря", считан за аутсайдер, триумфира в купа "Надежда". Жокей Георги Атанасов направи перфектното яздене, извеждайки коня си до победата в последните метри. "Знаех, че имаме сили, просто чакахме нашия момент," сподели развълнуваният Атанасов след финала.', 'https://images.unsplash.com/photo-1580974582235-4996ef109bbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxqb2NrZXklMjBob3JzZXxlbnwwfHx8fDE3NTYyODYyMTh8MA&ixlib=rb-4.1.0&q=80&w=1080', '/news/2', 980, 18, 4),
('Нови таланти на хоризонта: Младите жокеи на България', '2024-08-05', 'Анализи', 'Разглеждаме кои са новите имена в жокейската професия, които обещават да разтърсят статуквото.', 'Сезон 2024 изглежда ще бъде поле за изява на новото поколение жокеи. Имена като младия Петър Петров и амбициозната Елена Василева вече записаха първите си победи и показват потенциал да се превърнат в звезди. Техният хъс и модерният им подход към състезанията внасят свежа енергия в спорта.', 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxqb2NrZXklMjBob3JzZXxlbnwwfHx8fDE3NTYyODYyMTh8MA&ixlib=rb-4.1.0&q=80&w=1080', '/news/3', 750, 15, 9),
('Хиподрум "Банкя" с нови подобрения за сезона', '2024-07-28', 'Новини', 'Ръководството на хиподрума инвестира в нова дренажна система и подобрени трибуни за зрителите.', 'За да посрещне новия състезателен сезон, хиподрум "Банкя" претърпя значителни подобрения. Новата дренажна система на пистата ще осигури оптимални условия за бягане дори при неблагоприятни метеорологични условия. Трибуните също са обновени, за да предложат повече комфорт на верните фенове на конните надбягвания.', 'https://images.unsplash.com/photo-1599493344583-14987041c2a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxob3JzZSUyMHJhY2UlMjB0cmFja3xlbnwwfHx8fDE3NTYyODYyMTh8MA&ixlib=rb-4.1.0&q=80&w=1080', '/news/4', 620, 12, 3),
('Голямото дерби наближава: Очаквания и фаворити', '2024-08-15', 'Предстоящи', 'С наближаването на най-очакваното събитие в календара, напрежението расте. Кои са конете, които ще се борят за слава?', 'С наближаването на най-очакваното събитие...', 'https://images.unsplash.com/photo-1730982538397-ee793b11fe44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxob3JzZSUyMHJhY2UlMjBmaW5pc2h8ZW58MHx8fHwxNzU2Mjg2MjE4fDA&ixlib=rb-4.1.0&q=80&w=1080', '/news/5', 1250, 24, 7);
