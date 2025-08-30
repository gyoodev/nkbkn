

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

export interface Submission {
    id: number;
    created_at: string;
    type: 'Жокей' | 'Треньор' | 'Кон' | 'Собственик';
    status: 'new' | 'read' | 'archived';
    name: string | null;

    // Shared Contact
    email: string | null;
    phone: string | null;
    
    // Person-specific
    first_name?: string | null;
    last_name?: string | null;
    date_of_birth?: string | null;
    egn?: string | null;
    address?: string | null;

    // Trainer specific
    horse_count?: number | null;
    
    // Horse specific
    horse_name?: string | null;
    age?: number | null;
    sire?: string | null;
    dam?: string | null;
    owner?: string | null;
    
    // Shared stats for horse/jockey/trainer
    mounts?: number | null;
    wins?: number | null;
}

export interface SocialLink {
    id: number;
    name: 'TikTok' | 'Facebook' | 'Instagram' | 'Youtube';
    url: string;
    created_at: string;
}

export interface ContactSubmission {
    id: number;
    created_at: string;
    name: string;
    email: string;
    message: string;
    status: 'pending' | 'answered';
}
