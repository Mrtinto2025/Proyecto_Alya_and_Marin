'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Star, Loader2, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import CardGrid from '@/components/common/CardGrid';
import AnimeCard from '@/components/anime/AnimeCard';
import { useToast } from '@/components/common/Toast';

export const metadata = {
  title: 'Anime Explorer | Alya & Marin Hub',
  description: 'Explora y descubre animes con filtros y recomendaciones.',
};

type AniListMedia = {
  id: number;
  title: { romaji?: string; english?: string; native?: string };
  coverImage?: { large?: string; color?: string };
  averageScore?: number;
  seasonYear?: number;
  episodes?: number;
  status?: string;
  genres?: string[];
};

function mapAnime(media: AniListMedia) {
  const title = media.title.english || media.title.romaji || media.title.native || 'Sin título';
  const statusMap: Record<string, 'airing' | 'completed' | 'upcoming'> = {
    FINISHED: 'completed',
    RELEASING: 'airing',
    NOT_YET_RELEASED: 'upcoming',
    CANCELLED: 'completed',
  };
  const safeStatus = statusMap[media.status || ''] || ('completed' as 'airing' | 'completed' | 'upcoming');
  return {
    id: media.id.toString(),
    title,
    coverImage:
      media.coverImage?.large || 'https://via.placeholder.com/300x450?text=Anime',
    rating: media.averageScore ? media.averageScore / 10 : 0,
    year: media.seasonYear || 0,
    episodes: media.episodes || 0,
    status: safeStatus,
    genres: media.genres || [],
  };
}

export default function AnimePage() {
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const [pageInfo, setPageInfo] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const fetchAnime = async (search?: string, page: number = 1) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('q', search);
      params.set('page', page.toString());
      params.set('perPage', '12');

      const res = await fetch(`/api/external/anime/search?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error al buscar');

      setResults(data.results || []);
      setPageInfo(data.pageInfo || null);
      setCurrentPage(page);
    } catch (error: any) {
      showToast(error.message || 'Error al buscar anime', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnime(); // trending/populares por defecto
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchAnime(query, 1);
  };

  const handleNextPage = () => {
    if (pageInfo?.hasNextPage) {
      fetchAnime(query, currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      fetchAnime(query, currentPage - 1);
    }
  };

  const mapped = useMemo(() => results.map(mapAnime), [results]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-4xl font-bold">Anime Explorer</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Busca, filtra y organiza tus animes favoritos con datos reales de AniList.
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="glass-effect p-4 rounded-xl flex flex-col gap-3 md:flex-row md:items-center">
            <div className="flex items-center gap-3 flex-1">
              <Search size={20} className="text-gray-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Busca por título, estudio, género..."
                className="w-full bg-transparent outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition"
              title="Filtros avanzados"
            >
              <Filter size={20} />
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Buscar'}
            </button>
          </form>
          {showFilters && (
            <p className="text-xs text-gray-500 mt-2 px-4">
              💡 Sugerencia: Los filtros avanzados (género, estado, año) estarán disponibles en la próxima actualización.
            </p>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Star className="text-yellow-500" /> Resultados
            </h2>
            {pageInfo && (
              <span className="text-sm text-gray-500">
                Página {pageInfo.currentPage} / {pageInfo.lastPage}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
              ))}
            </div>
          ) : mapped.length > 0 ? (
            <>
              <CardGrid>
                {mapped.map((item) => (
                  <Link key={item.id} href={`/anime/${item.id}`} className="block">
                    <AnimeCard item={item} />
                  </Link>
                ))}
              </CardGrid>
              
              {/* Pagination */}
              {pageInfo && pageInfo.lastPage > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <ChevronLeft size={18} /> Anterior
                  </button>
                  <span className="text-sm font-semibold">
                    {currentPage} de {pageInfo.lastPage}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={!pageInfo.hasNextPage}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    Siguiente <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg font-semibold">No se encontraron animes</p>
              <p className="text-sm">Prueba con otro término o revisa la conexión</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
