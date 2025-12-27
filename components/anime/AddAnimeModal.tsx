'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useToast } from '@/components/common/Toast';
import { useAnimeList } from '@/hooks/useAnimeList';
import { AnimeItem } from '@/lib/types';

interface AddAnimeModalProps {
  anime: AnimeItem;
  onClose: () => void;
}

const statuses: Array<'watching' | 'completed' | 'plan-to-watch' | 'dropped' | 'on-hold'> = [
  'watching',
  'completed',
  'plan-to-watch',
  'dropped',
  'on-hold',
];

const statusLabels: Record<string, string> = {
  watching: 'Viendo',
  completed: 'Completado',
  'plan-to-watch': 'Plan to Watch',
  dropped: 'Abandonado',
  'on-hold': 'En Espera',
};

export default function AddAnimeModal({ anime, onClose }: AddAnimeModalProps) {
  const { showToast } = useToast();
  const { addAnime } = useAnimeList();

  const [status, setStatus] = useState<'watching' | 'completed' | 'plan-to-watch' | 'dropped' | 'on-hold'>('plan-to-watch');
  const [rating, setRating] = useState(0);
  const [episodesWatched, setEpisodesWatched] = useState(0);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const result = await addAnime({
        animeId: anime.id,
        status,
        rating: rating > 0 ? rating : undefined,
        episodesWatched: episodesWatched > 0 ? episodesWatched : undefined,
        notes: notes || undefined,
      });

      if (result.success) {
        showToast(`${anime.title} agregado a tu lista`, 'success');
        onClose();
      } else {
        showToast(result.error || 'Error al agregar', 'error');
      }
    } catch (error: any) {
      showToast(error.message || 'Error desconocido', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">Agregar Anime</h2>
            <p className="text-gray-500 text-sm mt-1">{anime.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Status */}
          <div>
            <label className="block text-sm font-semibold mb-2">Estado</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {statusLabels[s]}
                </option>
              ))}
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Calificación ({rating}/10)
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Episodes Watched */}
          {anime.episodes > 0 && (
            <div>
              <label className="block text-sm font-semibold mb-2">
                Episodios Vistos (de {anime.episodes})
              </label>
              <input
                type="number"
                min="0"
                max={anime.episodes}
                value={episodesWatched}
                onChange={(e) => setEpisodesWatched(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold mb-2">Notas</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Agrega tus comentarios..."
              maxLength={1000}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">{notes.length}/1000</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            {isLoading ? 'Agregando...' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  );
}
