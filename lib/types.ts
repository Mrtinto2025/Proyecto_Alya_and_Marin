// Tipos comunes de la aplicación

export interface User {
  _id: string;
  username: string;
  email: string;
  image?: string;
  role: 'user' | 'admin';
  bio?: string;
  favoriteAnime?: string[];
  favoriteManga?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AnimeList {
  userId: string;
  animeId: string;
  status: 'watching' | 'completed' | 'plan-to-watch' | 'dropped' | 'on-hold';
  rating?: number;
  episodesWatched?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MangaList {
  userId: string;
  mangaId: string;
  status: 'reading' | 'completed' | 'plan-to-read' | 'dropped' | 'on-hold';
  rating?: number;
  chaptersRead?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AnimeItem {
  id: string;
  title: string;
  coverImage: string;
  rating: number;
  year: number;
  episodes: number;
  status: 'airing' | 'completed' | 'upcoming';
  genres: string[];
}

export interface MangaItem {
  id: string;
  title: string;
  coverImage: string;
  rating: number;
  year: number;
  chapters: number;
  status: 'ongoing' | 'completed' | 'hiatus';
  genres: string[];
}
