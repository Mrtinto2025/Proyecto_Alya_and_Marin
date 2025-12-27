'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useToast } from '@/components/common/Toast';
import { useMangaList } from '@/hooks/useMangaList';
import { MangaItem } from '@/lib/types';

interface AddMangaModalProps {
  manga: MangaItem;
  onClose: () => void;
}

const statuses: Array<'reading' | 'completed' | 'plan-to-read' | 'dropped' | 'on-hold'> = [
  'reading',
  'completed',
  'plan-to-read',
  'dropped',
  'on-hold',
];

const statusLabels: Record<string, string> = {
  reading: 'Leyendo',
  completed: 'Completado',
  'plan-to-read': 'Plan to Read',
  dropped: 'Abandonado',
  'on-hold': 'En Espera',
};

export default function AddMangaModal({ manga, onClose }: AddMangaModalProps) {
  const { showToast } = useToast();
  const { addManga } = useMangaList();

  const [status, setStatus] = useState<'reading' | 'completed' | 'plan-to-read' | 'dropped' | 'on-hold'>('plan-to-read');
  const [rating, setRating] = useState(0);
  const [chaptersRead, setChaptersRead] = useState(0);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const result = await addManga({
        mangaId: manga.id,
        status,
        rating: rating > 0 ? rating : undefined,
        chaptersRead: chaptersRead > 0 ? chaptersRead : undefined,
        notes: notes || undefined,
      });

      if (result.success) {
        showToast(`${manga.title} agregado a tu lista`, 'success');
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
            <h2 className="text-2xl font-bold">Agregar Manga</h2>
            <p className="text-gray-500 text-sm mt-1">{manga.title}</p>
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary-500"
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

          {/* Chapters Read */}
          {manga.chapters > 0 && (
            <div>
              <label className="block text-sm font-semibold mb-2">
                Capítulos Leídos (de {manga.chapters})
              </label>
              <input
                type="number"
                min="0"
                max={manga.chapters}
                value={chaptersRead}
                onChange={(e) => setChaptersRead(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary-500"
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary-500 resize-none"
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
            className="flex-1 px-4 py-2 bg-gradient-to-r from-secondary-500 to-primary-500 text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            {isLoading ? 'Agregando...' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  );
}
