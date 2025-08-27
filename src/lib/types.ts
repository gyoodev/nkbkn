
export interface Jockey {
  id: number;
  name: string;
  stats: {
    wins: number;
    mounts: number;
    winRate: string;
  };
  imageUrl: string;
}

export interface Trainer {
  id: number;
  name: string;
  achievements: string[];
  associatedHorses: string[];
  imageUrl: string;
}

export interface Horse {
  id: number;
  name: string;
  sire: string;
  dam: string;
  age: number;
  owner: string;
  pastResults: {
    date: string;
    track: string;
    position: number;
  }[];
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
    comments_count: number;
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
