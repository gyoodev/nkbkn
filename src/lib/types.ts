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
  name: string;
  location: string;
  description: string;
}
