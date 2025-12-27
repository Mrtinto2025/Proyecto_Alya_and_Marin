import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

interface AnimeListEntry {
  _id: string;
  animeId: string;
  status: 'watching' | 'completed' | 'plan-to-watch' | 'dropped' | 'on-hold';
  rating?: number;
  episodesWatched?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export function useAnimeList(status?: string) {
  const { isAuthenticated } = useAuth();
  const [animeList, setAnimeList] = useState<AnimeListEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnimeList = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const url = status ? `/api/anime/list?status=${status}` : '/api/anime/list';
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Error al obtener lista de anime');
      }

      const data = await response.json();
      setAnimeList(data.animeList);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, status]);

  useEffect(() => {
    fetchAnimeList();
  }, [fetchAnimeList]);

  const addAnime = async (animeData: {
    animeId: string;
    status: string;
    rating?: number;
    episodesWatched?: number;
    notes?: string;
  }) => {
    try {
      const response = await fetch('/api/anime/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(animeData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al agregar anime');
      }

      await fetchAnimeList();
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const updateAnime = async (id: string, updateData: {
    status?: string;
    rating?: number;
    episodesWatched?: number;
    notes?: string;
  }) => {
    try {
      const response = await fetch(`/api/anime/list/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar anime');
      }

      await fetchAnimeList();
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const deleteAnime = async (id: string) => {
    try {
      const response = await fetch(`/api/anime/list/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar anime');
      }

      await fetchAnimeList();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const getAnimeById = (id: string) => {
    return animeList.find(anime => anime._id === id);
  };

  const getAnimeByAnimeId = (animeId: string) => {
    return animeList.find(anime => anime.animeId === animeId);
  };

  return {
    animeList,
    isLoading,
    error,
    addAnime,
    updateAnime,
    deleteAnime,
    getAnimeById,
    getAnimeByAnimeId,
    refetch: fetchAnimeList,
  };
}
