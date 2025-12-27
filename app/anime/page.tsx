'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Star, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import CardGrid from '@/components/common/CardGrid';
import AnimeCard from '@/components/anime/AnimeCard';
import { useToast } from '@/components/common/Toast';

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
  const safeStatus = statusMap[media.status || ''] || 'completed';
  return {
    id: media.id.toString(),
    title,
    coverImage: media.coverImage?.large || 'https://via.placeholder.com/300x450?text=Anime',
    rating: media.averageScore ? media.averageScore / 10 : 0,
    year: media.seasonYear || 0,
    episodes: media.episodes || 0,
    status: safeStatus,
    genres: media.genres || [],
  };
}

export default function AnimePage() {
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const [pageInfo, setPageInfo] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [genre, setGenre] = useState('');
  const [status, setStatus] = useState('');
  const [year, setYear] = useState('');
  const [sort, setSort] = useState('popularity');
  const isHydrated = useRef(false);

  const genreOptions = ['Acción', 'Aventura', 'Comedia', 'Drama', 'Fantasía', 'Romance', 'Sci-Fi', 'Slice of Life', 'Deportes'];
  const statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'airing', label: 'En emisión' },
    { value: 'completed', label: 'Completados' },
    { value: 'upcoming', label: 'Próximos' },
  ];
  const sortOptions = [
    { value: 'popularity', label: 'Popularidad' },
    { value: 'score', label: 'Puntuación' },
    { value: 'year', label: 'Año' },
  ];

  const fetchAnime = async (
    search: string,
    page: number = 1,
    filters?: { genre?: string; status?: string; year?: string; sort?: string }
  ) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('q', search);
      if (filters?.genre) params.set('genre', filters.genre);
      if (filters?.status) params.set('status', filters.status);
      if (filters?.year) params.set('year', filters.year);
      // Si no hay búsqueda ni filtros, usar popularidad por defecto
      params.set('sort', filters?.sort || 'popularity');
      params.set('page', page.toString());
      params.set('perPage', '12');

      const res = await fetch(`/api/external/anime/search?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al buscar');

      setResults(data.results || []);
      setPageInfo(data.pageInfo || null);
    } catch (error: any) {
      showToast(error.message || 'Error al buscar anime', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get('q') || '';
    const g = searchParams.get('genre') || '';
    const st = searchParams.get('status') || '';
    const yr = searchParams.get('year') || '';
    const srt = searchParams.get('sort') || 'popularity';
    const pg = Number(searchParams.get('page') || '1');
    setQuery(q);
    setDebouncedQuery(q);
    setGenre(g);
    setStatus(st);
    setYear(yr);
    setSort(srt);
    setCurrentPage(pg);
    isHydrated.current = true;
    
    // Ejecutar búsqueda inicial inmediatamente
    fetchAnime(q, pg, { genre: g, status: st, year: yr, sort: srt });
  }, []);

  useEffect(() => {
    if (!isHydrated.current) return;
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    if (!isHydrated.current) return;
    const params = new URLSearchParams();
    if (debouncedQuery) params.set('q', debouncedQuery);
    if (genre) params.set('genre', genre);
    if (status) params.set('status', status);
    if (year) params.set('year', year);
    if (sort) params.set('sort', sort);
    params.set('page', currentPage.toString());
    router.replace(`?${params.toString()}`, { scroll: false });

    fetchAnime(debouncedQuery, currentPage, { genre, status, year, sort });
  }, [debouncedQuery, genre, status, year, sort, currentPage, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setDebouncedQuery(query);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    if (pageInfo?.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const mapped = useMemo(() => results.map(mapAnime), [results]);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold text-white">Explora Anime</h1>
            <p className="text-gray-300 text-lg">
              Descubre tu próximo anime favorito, explora las tendencias y encuentra recomendaciones personalizadas.
            </p>
          </div>

          <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <form onSubmit={handleSubmit} className="flex-1">
                  <div className="relative flex items-center">
                    <Search className="absolute left-4 text-gray-400" size={20} />
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Buscar por título"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 px-4 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                    >
                      Buscar
                    </button>
                  </div>
                </form>

                <button
                  onClick={() => setShowFilters((prev) => !prev)}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-200 bg-gray-700 rounded-xl hover:bg-gray-600 transition-colors"
                >
                  <SlidersHorizontal size={16} />
                  Filtros
                </button>
              </div>

              <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 transition-all ${showFilters ? 'grid' : 'hidden md:grid'}`}>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-300">Género</label>
                  <select
                    value={genre}
                    onChange={(e) => {
                      setGenre(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="rounded-xl border-gray-600 bg-gray-700 text-white"
                  >
                    <option value="">Todos</option>
                    {genreOptions.map((g) => (
                      <option key={g} value={g.toLowerCase()}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-300">Estado</label>
                  <select
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="rounded-xl border-gray-600 bg-gray-700 text-white"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-300">Año</label>
                  <input
                    type="number"
                    min="1950"
                    max={new Date().getFullYear() + 1}
                    value={year}
                    onChange={(e) => {
                      setYear(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Ej: 2024"
                    className="rounded-xl border-gray-600 bg-gray-700 text-white placeholder-gray-400 px-3 py-2"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-300">Ordenar por</label>
                  <select
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="rounded-xl border-gray-600 bg-gray-700 text-white"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <section className="pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold flex items-center gap-2 text-white">
                  <Star className="text-yellow-500" /> 
                  {debouncedQuery || genre || status || year ? 'Resultados' : 'Animes Populares'}
                </h2>
                {pageInfo && (
                  <span className="text-sm text-gray-400">
                    Página {pageInfo.currentPage} / {pageInfo.lastPage}
                  </span>
                )}
              </div>

              {isLoading ? (
                <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-64 rounded-xl bg-gray-700 animate-pulse" />
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

                  {pageInfo && pageInfo.lastPage > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-8">
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition text-white"
                      >
                        <ChevronLeft size={18} /> Anterior
                      </button>
                      <span className="text-sm font-semibold text-white">
                        {currentPage} de {pageInfo.lastPage}
                      </span>
                      <button
                        onClick={handleNextPage}
                        disabled={!pageInfo.hasNextPage}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition text-white"
                      >
                        Siguiente <ChevronRight size={18} />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16 text-gray-400">
                  <p className="text-lg font-semibold">No se encontraron animes</p>
                  <p className="text-sm">Prueba con otro término o revisa la conexión</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
