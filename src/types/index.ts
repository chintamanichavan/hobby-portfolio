export interface Photo {
  id: string;
  src: string;
  alt: string;
  location: string;
  year: number;
  caption?: string;
}

export type PoemLanguage = 'english' | 'marathi' | 'hindi';

export interface Poem {
  id: string;
  title: string;
  body: string;
  date: string;
  language: PoemLanguage;
  note?: string;
}

export interface TravelEntry {
  id: string;
  destination: string;
  country: string;
  year: number;
  coverImage: string;
  excerpt: string;
  body: string;
  tags: string[];
}

export interface CookingEntry {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  youtubeId: string | null;
  tags: string[];
  duration: string;
}

export interface GuitarEntry {
  id: string;
  milestone: string;
  song: string;
  note: string;
  thumbnail: string;
  youtubeId: string | null;
  month: string;
}
