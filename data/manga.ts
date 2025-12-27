import { MangaItem } from '@/lib/types';

export const mangaMock: MangaItem[] = [
  {
    id: 'm1',
    title: 'Rose Garden',
    coverImage: 'https://picsum.photos/seed/manga1/600/800',
    rating: 8.5,
    year: 2019,
    chapters: 86,
    status: 'ongoing',
    genres: ['Romance', 'Drama'],
  },
  {
    id: 'm2',
    title: 'Steel Code',
    coverImage: 'https://picsum.photos/seed/manga2/600/800',
    rating: 8.9,
    year: 2021,
    chapters: 45,
    status: 'ongoing',
    genres: ['Acción', 'Sci-Fi'],
  },
  {
    id: 'm3',
    title: 'Moon Chronicles',
    coverImage: 'https://picsum.photos/seed/manga3/600/800',
    rating: 9.2,
    year: 2017,
    chapters: 120,
    status: 'completed',
    genres: ['Fantasia', 'Aventura'],
  },
  {
    id: 'm4',
    title: 'Shadow Archive',
    coverImage: 'https://picsum.photos/seed/manga4/600/800',
    rating: 7.8,
    year: 2018,
    chapters: 62,
    status: 'completed',
    genres: ['Misterio', 'Thriller'],
  },
];
