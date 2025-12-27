import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  role: string;
  bio?: string;
  image?: string;
  favoriteAnime: string[];
  favoriteManga: string[];
  createdAt: string;
  updatedAt: string;
}

export function useProfile() {
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/user/profile');

      if (!response.ok) {
        throw new Error('Error al obtener perfil');
      }

      const data = await response.json();
      setProfile(data.user);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updateData: {
    username?: string;
    bio?: string;
    image?: string;
  }) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar perfil');
      }

      await fetchProfile();
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const addFavoriteAnime = async (animeId: string) => {
    try {
      const response = await fetch('/api/user/favorites/anime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ animeId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al agregar favorito');
      }

      await fetchProfile();
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const removeFavoriteAnime = async (animeId: string) => {
    try {
      const response = await fetch(`/api/user/favorites/anime?animeId=${animeId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar favorito');
      }

      await fetchProfile();
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const addFavoriteManga = async (mangaId: string) => {
    try {
      const response = await fetch('/api/user/favorites/manga', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mangaId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al agregar favorito');
      }

      await fetchProfile();
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const removeFavoriteManga = async (mangaId: string) => {
    try {
      const response = await fetch(`/api/user/favorites/manga?mangaId=${mangaId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar favorito');
      }

      await fetchProfile();
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const isFavoriteAnime = (animeId: string) => {
    return profile?.favoriteAnime.includes(animeId) || false;
  };

  const isFavoriteManga = (mangaId: string) => {
    return profile?.favoriteManga.includes(mangaId) || false;
  };

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    addFavoriteAnime,
    removeFavoriteAnime,
    addFavoriteManga,
    removeFavoriteManga,
    isFavoriteAnime,
    isFavoriteManga,
    refetch: fetchProfile,
  };
}
