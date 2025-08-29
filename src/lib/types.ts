

export interface Jockey {
  id: number;
  name: string;
  wins: number;
  mounts: number;
  winRate: string;
  imageUrl: string;
}

export interface Trainer {
  id: number;
  name: string;
  achievements: string[];
  stats: {
    wins: number;
    mounts: number;
  };
  image_url: string;
}

export interface Horse {
  id: number;
  name: string;
  sire: string;
  dam: string;
  age: number;
  owner: string;
  wins: number;
  mounts: number;
  bestTime: string | null;
}

export interface Track {
  id: number;
  name:string;
  location: string;
  description: string;
}

export interface NewsPost {
    id: number;
    title: string;
    date: string;
    category: string;
    excerpt: string;
    content: string;
    image_url: string;
    href: string;
    views: number;
    likes: number;
    comments: Comment[];
}

export interface Race {
  id: number;
  event_id: number;
  time: string;
  name: string;
  participants: number;
}

export interface RaceEvent {
  id: number;
  date: string;
  track: string;
  races: Race[];
}


export interface Document {
  id: number;
  name: string;
  type: 'Правилник' | 'Формуляр';
  created_at: string;
  path: string;
  href: string;
}

export interface Result {
    id: number;
    raceName: string;
    date: string;
    track: string;
    winner: string;
    jockey: string;
    time: string;
}

export interface Partner {
    id: number;
    name: string;
    logo_url: string;
    created_at: string;
}

export interface SiteContent {
    key: string;
    content: string;
}

export type UserProfile = {
  id: string
  full_name: string | null
  username: string | null
  avatar_url: string | null
}

export interface Comment {
  id: number
  created_at: string
  content: string
  post_id: number
  user_id: string | null
  guest_name: string | null
  profiles: UserProfile | null
}
