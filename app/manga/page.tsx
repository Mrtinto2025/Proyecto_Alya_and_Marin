'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, BookOpen, Loader2, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import CardGrid from '@/components/common/CardGrid';
import MangaCard from '@/components/manga/MangaCard';
import { useToast } from '@/components/common/Toast';

type AniListMedia = {
  id: number;
  title: { romaji?: string; english?: string; native?: string };
  coverImage?: { large?: string; color?: string };
  averageScore?: number;
  seasonYear?: number;
  chapters?: number;
  status?: string;
  genres?: string[];
};

function mapManga(media: AniListMedia) {
  const title = media.title.english || media.title.romaji || media.title.native || 'Sin título';
  const statusMap: Record<string, 'ongoing' | 'completed' | 'hiatus'> = {
    FINISHED: 'completed',
    RELEASING: 'ongoing',
    NOT_YET_RELEASED: 'hiatus',
    CANCELLED: 'completed',
  };
  const safeStatus = statusMap[media.status || ''] || ('completed' as 'ongoing' | 'completed' | 'hiatus');
  return {
    id: media.id.toString(),
    title,
    coverImage:
      media.coverImage?.large || 'https://via.placeholder.com/300x450?text=Manga',
    rating: media.averageScore ? media.averageScore / 10 : 0,
    year: media.seasonYear || 0,
    chapters: media.chapters || 0,
    status: safeStatus,
    genres: media.genres || [],
  };
}

const GENRES = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life'];
const STATUS_OPTIONS = [
  { value: 'airing', label: 'En serialización' },
  { value: 'completed', label: 'Completado' },
  { value: 'upcoming', label: 'Próximo' },
];
const SORT_OPTIONS = [
  { value: 'popularity', label: 'Popularidad' },
  { value: 'score', label: 'Puntuación' },
  { value: 'year', label: 'Año' },
];
const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

export default function MangaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || '');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || '');
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year') || '');
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || 'popularity');
  
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const [pageInfo, setPageInfo] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  const debounceTimer = useRef<NodeJS.Timeout>();

  const fetchManga = async (search?: string, page: number = 1, filters?: any) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      
      if (search) params.set('q', search);
      if (filters?.genre) params.set('genre', filters.genre);
      if (filters?.status) params.set('status', filters.status);
      if (filters?.year) params.set('year', filters.year);
      if (filters?.sort) params.set('sort', filters.sort);
      
      params.set('page', page.toString());
      params.set('perPage', '12');

      const res = await fetch(`/api/external/manga/search?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error al buscar');

      setResults(data.results || []);
      setPageInfo(data.pageInfo || null);
      setCurrentPage(page);
    } catch (error: any) {
      showToast(error.message || 'Error al buscar manga', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Carga inicial basada en URL
  useEffect(() => {
    const filters = {
      genre: searchParams.get('genre') || undefined,
      status: searchParams.get('status') || undefined,
      year: searchParams.get('year') || undefined,
      sort: searchParams.get('sort') || 'popularity',
    };
    fetchManga(query, 1, filters);
  }, []);

  // Debounce en búsqueda
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      const filters = { genre: selectedGenre || undefined, status: selectedStatus || undefined, year: selectedYear || undefined, sort: selectedSort };
      fetchManga(query, 1, filters);
      
      // Actualizar URL
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (selectedGenre) params.set('genre', selectedGenre);
      if (selectedStatus) params.set('status', selectedStatus);
      if (selectedYear) params.set('year', selectedYear);
      if (selectedSort) params.set('sort', selectedSort);
      
      router.push(`?${params.toString()}`);
    }, 400);
  }, [query, selectedGenre, selectedStatus, selectedYear, selectedSort, router]);

  const handleNextPage = () => {
    if (pageInfo?.hasNextPage) {
      const filters = { genre: selectedGenre || undefined, status: selectedStatus || undefined, year: selectedYear || undefined, sort: selectedSort };
      fetchManga(query, currentPage + 1, filters);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const filters = { genre: selectedGenre || undefined, status: selectedStatus || undefined, year: selectedYear || undefined, sort: selectedSort };
      fetchManga(query, currentPage - 1, filters);
    }
  };

  const mapped = useMemo(() => results.map(mapManga), [results]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-4xl font-bold">Manga Explorer</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Encuentra mangas y lleva control de tu lectura con datos reales.
          </p>
        </div>
      </section>

      {/* Search y Filtros */}
      <section className="py-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl flex flex-col gap-3 md:flex-row md:items-center mb-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 flex-1">
              <Search size={20} className="text-gray-500 dark:text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Busca por título, autor, demografía..."
                className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-secondary-500 dark:hover:text-secondary-400 transition flex items-center gap-2"
              title="Filtros avanzados"
            >
              <Filter size={20} /> Filtros
            </button>
          </div>

          {/* Filtros Expandibles */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              {/* Género */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2 uppercase">Género</label>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary-500"
                >
                  <option value="">Todos</option>
                  {GENRES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              {/* Estado */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2 uppercase">Estado</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary-500"
                >
                  <option value="">Todos</option>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              {/* Año */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2 uppercase">Año</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary-500"
                >
                  <option value="">Todos</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Ordenar */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2 uppercase">Ordenar por</label>
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary-500"
                >
                  {SORT_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="pb-16 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
              <BookOpen className="text-secondary-500" /> Resultados
            </h2>
            {pageInfo && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
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
                  <Link key={item.id} href={`/manga/${item.id}`} className="block">
                    <MangaCard item={item} />
                  </Link>
                ))}
              </CardGrid>
              
              {/* Pagination */}
              {pageInfo && pageInfo.lastPage > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition text-gray-900 dark:text-white"
                  >
                    <ChevronLeft size={18} /> Anterior
                  </button>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {currentPage} de {pageInfo.lastPage}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={!pageInfo.hasNextPage}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition text-gray-900 dark:text-white"
                  >
                    Siguiente <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg font-semibold">No se encontraron mangas</p>
              <p className="text-sm">Prueba con otro término o revisa la conexión</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
