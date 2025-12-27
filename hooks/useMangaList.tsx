import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

interface MangaListEntry {
  _id: string;
  mangaId: string;
  status: 'reading' | 'completed' | 'plan-to-read' | 'dropped' | 'on-hold';
  rating?: number;
  chaptersRead?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export function useMangaList(status?: string) {
  const { isAuthenticated } = useAuth();
  const [mangaList, setMangaList] = useState<MangaListEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMangaList = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const url = status ? `/api/manga/list?status=${status}` : '/api/manga/list';
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Error al obtener lista de manga');
      }

      const data = await response.json();
      setMangaList(data.mangaList);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, status]);

  useEffect(() => {
    fetchMangaList();
  }, [fetchMangaList]);

  const addManga = async (mangaData: {
    mangaId: string;
    status: string;
    rating?: number;
    chaptersRead?: number;
    notes?: string;
  }) => {
    try {
      const response = await fetch('/api/manga/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mangaData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al agregar manga');
      }

      await fetchMangaList();
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const updateManga = async (id: string, updateData: {
    status?: string;
    rating?: number;
    chaptersRead?: number;
    notes?: string;
  }) => {
    try {
      const response = await fetch(`/api/manga/list/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar manga');
      }

      await fetchMangaList();
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const deleteManga = async (id: string) => {
    try {
      const response = await fetch(`/api/manga/list/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar manga');
      }

      await fetchMangaList();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const getMangaById = (id: string) => {
    return mangaList.find(manga => manga._id === id);
  };

  const getMangaByMangaId = (mangaId: string) => {
    return mangaList.find(manga => manga.mangaId === mangaId);
  };

  return {
    mangaList,
    isLoading,
    error,
    addManga,
    updateManga,
    deleteManga,
    getMangaById,
    getMangaByMangaId,
    refetch: fetchMangaList,
  };
}
