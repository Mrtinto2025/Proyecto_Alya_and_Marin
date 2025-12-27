'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Play, Users, Star, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/common/Toast';
import { useAuth } from '@/hooks/useAuth';
import { useAnimeList } from '@/hooks/useAnimeList';
import AddAnimeModal from '@/components/anime/AddAnimeModal';
import Image from 'next/image';

type AnimeDetail = {
  id: number;
  title: { romaji?: string; english?: string; native?: string };
  coverImage?: { extraLarge?: string; large?: string; color?: string };
  bannerImage?: string;
  description?: string;
  episodes?: number;
  duration?: number;
  format?: string;
  status?: string;
  season?: string;
  seasonYear?: number;
  averageScore?: number;
  popularity?: number;
  genres?: string[];
  studios?: { nodes: { name: string }[] };
  characters?: {
    edges: {
      role: string;
      node: { id: number; name: { full: string }; image?: { large?: string } };
    }[];
  };
};

export default function AnimeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const { user } = useAuth();
  const { addAnime } = useAnimeList();

  const [anime, setAnime] = useState<AnimeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isInList, setIsInList] = useState(false);

  const id = params.id as string;

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/external/anime/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Error al cargar');

        setAnime(data.result);
      } catch (error: any) {
        showToast(error.message || 'Error al cargar detalles', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [id, showToast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-500" size={40} />
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Anime no encontrado</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:opacity-90"
        >
          Volver
        </button>
      </div>
    );
  }

  const title = anime.title.english || anime.title.romaji || anime.title.native || 'Sin título';
  const coverImage = anime.coverImage?.extraLarge || anime.coverImage?.large || 'https://via.placeholder.com/300x450';
  const studios = anime.studios?.nodes?.map((s) => s.name).join(', ') || 'Desconocido';
  const characters = anime.characters?.edges || [];

  return (
    <div className="min-h-screen">
      {/* Banner */}
      {anime.bannerImage && (
        <div className="h-64 w-full relative overflow-hidden">
          <Image
            src={anime.bannerImage}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-white dark:to-gray-900"></div>
        </div>
      )}

      <div className="relative -mt-32 px-4 sm:px-6 lg:px-8 pb-8">
        {/* Header con botón volver */}
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
        >
          <ArrowLeft size={20} /> Volver
        </button>

        {/* Card Principal */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 sm:p-8 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Poster */}
            <div className="md:col-span-1 flex justify-center md:justify-start">
              <div className="relative w-48 h-72 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={coverImage}
                  alt={title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Info */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">{title}</h1>
                <p className="text-gray-500">{anime.title.romaji}</p>
              </div>

              {/* Ratings y Stats */}
              <div className="flex flex-wrap gap-4 text-sm">
                {anime.averageScore && (
                  <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-2 rounded-lg">
                    <Star className="text-yellow-500" size={16} />
                    <span className="font-semibold">{anime.averageScore / 10} / 10</span>
                  </div>
                )}
                {anime.episodes && (
                  <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-3 py-2 rounded-lg">
                    <Play className="text-blue-500" size={16} />
                    <span>{anime.episodes} episodios</span>
                  </div>
                )}
                {anime.seasonYear && (
                  <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 px-3 py-2 rounded-lg">
                    <Calendar className="text-purple-500" size={16} />
                    <span>{anime.seasonYear}</span>
                  </div>
                )}
              </div>

              {/* Detalles */}
              <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-gray-500 text-xs uppercase">Formato</p>
                  <p className="font-semibold">{anime.format || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase">Estado</p>
                  <p className="font-semibold">{anime.status || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase">Duración</p>
                  <p className="font-semibold">{anime.duration ? `${anime.duration} min` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase">Estudio</p>
                  <p className="font-semibold">{studios}</p>
                </div>
              </div>

              {/* Genres */}
              {anime.genres && anime.genres.length > 0 && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-500 text-xs uppercase mb-2">Géneros</p>
                  <div className="flex flex-wrap gap-2">
                    {anime.genres.map((genre) => (
                      <span
                        key={genre}
                        className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs font-semibold"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Botón Agregar */}
              {user && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-6 w-full sm:w-auto flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:opacity-90 transition"
                >
                  <Plus size={20} /> Agregar a mi lista
                </button>
              )}
            </div>
          </div>

          {/* Descripción */}
          {anime.description && (
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-4">Sinopsis</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{anime.description}</p>
            </div>
          )}

          {/* Personajes */}
          {characters.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Users size={24} /> Personajes
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {characters.slice(0, 12).map((char) => (
                  <div key={char.node.id} className="text-center">
                    {char.node.image?.large && (
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2">
                        <Image
                          src={char.node.image.large}
                          alt={char.node.name.full}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <p className="text-xs font-semibold truncate">{char.node.name.full}</p>
                    <p className="text-xs text-gray-500">{char.role}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Agregar */}
      {showAddModal && (
        <AddAnimeModal
          anime={{
            id: anime.id.toString(),
            title,
            coverImage,
            rating: anime.averageScore ? anime.averageScore / 10 : 0,
            year: anime.seasonYear || 0,
            episodes: anime.episodes || 0,
            status: (anime.status || 'UNKNOWN').toLowerCase() as any,
            genres: anime.genres || [],
          }}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
