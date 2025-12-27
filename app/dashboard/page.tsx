'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAnimeList } from '@/hooks/useAnimeList';
import { useMangaList } from '@/hooks/useMangaList';
import { useProfile } from '@/hooks/useProfile';
import Link from 'next/link';
import { 
  User, 
  TrendingUp, 
  BookOpen, 
  Play, 
  Star,
  Settings,
  Plus,
  Clock,
  CheckCircle2
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading: authLoading, requireAuth } = useAuth();
  const { animeList, isLoading: animeLoading } = useAnimeList();
  const { mangaList, isLoading: mangaLoading } = useMangaList();
  const { profile, isLoading: profileLoading } = useProfile();

  useEffect(() => {
    requireAuth();
  }, []);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) return null;

  // Calcular estadísticas
  const animeWatching = animeList.filter(a => a.status === 'watching').length;
  const animeCompleted = animeList.filter(a => a.status === 'completed').length;
  const mangaReading = mangaList.filter(m => m.status === 'reading').length;
  const mangaCompleted = mangaList.filter(m => m.status === 'completed').length;

  const totalAnime = animeList.length;
  const totalManga = mangaList.length;

  const recentAnime = animeList.slice(0, 5);
  const recentManga = mangaList.slice(0, 5);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white text-2xl font-bold">
              {profile?.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold">¡Bienvenido, {profile?.username}! 👋</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {profile?.bio || 'Configura tu biografía en tu perfil'}
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/profile"
            className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 glass-effect rounded-lg hover:shadow-lg transition-shadow"
          >
            <Settings size={20} />
            Editar perfil
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Anime Watching */}
          <div className="glass-effect p-6 rounded-xl card-hover">
            <div className="flex items-center justify-between mb-2">
              <Play className="text-primary-500" size={24} />
              <span className="text-2xl font-bold">{animeWatching}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Viendo ahora</p>
            <div className="mt-2 text-xs text-gray-500">Anime</div>
          </div>

          {/* Anime Completed */}
          <div className="glass-effect p-6 rounded-xl card-hover">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="text-green-500" size={24} />
              <span className="text-2xl font-bold">{animeCompleted}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Completados</p>
            <div className="mt-2 text-xs text-gray-500">Anime</div>
          </div>

          {/* Manga Reading */}
          <div className="glass-effect p-6 rounded-xl card-hover">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="text-secondary-500" size={24} />
              <span className="text-2xl font-bold">{mangaReading}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Leyendo ahora</p>
            <div className="mt-2 text-xs text-gray-500">Manga</div>
          </div>

          {/* Manga Completed */}
          <div className="glass-effect p-6 rounded-xl card-hover">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="text-green-500" size={24} />
              <span className="text-2xl font-bold">{mangaCompleted}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Completados</p>
            <div className="mt-2 text-xs text-gray-500">Manga</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/dashboard/anime"
            className="glass-effect p-6 rounded-xl card-hover group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <Play className="text-primary-500" />
                  Mi Lista de Anime
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {totalAnime} anime{totalAnime !== 1 ? 's' : ''} en tu lista
                </p>
              </div>
              <Plus className="text-gray-400 group-hover:text-primary-500 transition-colors" size={32} />
            </div>
          </Link>

          <Link
            href="/dashboard/manga"
            className="glass-effect p-6 rounded-xl card-hover group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <BookOpen className="text-secondary-500" />
                  Mi Lista de Manga
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {totalManga} manga{totalManga !== 1 ? 's' : ''} en tu lista
                </p>
              </div>
              <Plus className="text-gray-400 group-hover:text-secondary-500 transition-colors" size={32} />
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Anime */}
          <div className="glass-effect p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Clock size={20} className="text-primary-500" />
                Actividad Reciente - Anime
              </h3>
              <Link href="/dashboard/anime" className="text-sm text-primary-500 hover:text-primary-600">
                Ver todo
              </Link>
            </div>
            {animeLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : recentAnime.length > 0 ? (
              <div className="space-y-3">
                {recentAnime.map(anime => (
                  <div key={anime._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium truncate">{anime.animeId}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="capitalize">{anime.status.replace('-', ' ')}</span>
                        {anime.episodesWatched && (
                          <>
                            <span>•</span>
                            <span>{anime.episodesWatched} eps</span>
                          </>
                        )}
                        {anime.rating && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Star size={14} className="text-yellow-500" />
                              {anime.rating}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Play size={48} className="mx-auto mb-2 opacity-50" />
                <p>No has agregado ningún anime aún</p>
                <Link href="/anime" className="text-primary-500 hover:underline mt-2 inline-block">
                  Explorar anime
                </Link>
              </div>
            )}
          </div>

          {/* Recent Manga */}
          <div className="glass-effect p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Clock size={20} className="text-secondary-500" />
                Actividad Reciente - Manga
              </h3>
              <Link href="/dashboard/manga" className="text-sm text-secondary-500 hover:text-secondary-600">
                Ver todo
              </Link>
            </div>
            {mangaLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : recentManga.length > 0 ? (
              <div className="space-y-3">
                {recentManga.map(manga => (
                  <div key={manga._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium truncate">{manga.mangaId}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="capitalize">{manga.status.replace('-', ' ')}</span>
                        {manga.chaptersRead && (
                          <>
                            <span>•</span>
                            <span>{manga.chaptersRead} caps</span>
                          </>
                        )}
                        {manga.rating && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Star size={14} className="text-yellow-500" />
                              {manga.rating}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen size={48} className="mx-auto mb-2 opacity-50" />
                <p>No has agregado ningún manga aún</p>
                <Link href="/manga" className="text-secondary-500 hover:underline mt-2 inline-block">
                  Explorar manga
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
