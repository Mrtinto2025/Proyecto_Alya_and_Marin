'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAnimeList } from '@/hooks/useAnimeList';
import { useToast } from '@/components/common/Toast';
import { Play, Filter, Plus, Trash2, Edit, Star } from 'lucide-react';
import EditListModal from '@/components/common/EditListModal';
import Link from 'next/link';

export default function MyAnimeListPage() {
  const { requireAuth } = useAuth();
  const { animeList, isLoading, updateAnime, deleteAnime } = useAnimeList();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<string>('all');
  const [editingEntry, setEditingEntry] = useState<any>(null);

  useEffect(() => {
    requireAuth();
  }, []);

  const filteredList = filter === 'all' 
    ? animeList 
    : animeList.filter(a => a.status === filter);

  const handleUpdate = async (id: string, data: any) => {
    const result = await updateAnime(id, data);
    if (result.success) {
      showToast('Anime actualizado exitosamente', 'success');
    } else {
      showToast(result.error || 'Error al actualizar', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteAnime(id);
    if (result.success) {
      showToast('Anime eliminado de tu lista', 'success');
    } else {
      showToast(result.error || 'Error al eliminar', 'error');
    }
  };

  const statusCounts = {
    all: animeList.length,
    watching: animeList.filter(a => a.status === 'watching').length,
    completed: animeList.filter(a => a.status === 'completed').length,
    'plan-to-watch': animeList.filter(a => a.status === 'plan-to-watch').length,
    'on-hold': animeList.filter(a => a.status === 'on-hold').length,
    dropped: animeList.filter(a => a.status === 'dropped').length,
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Play className="text-primary-500" />
            Mi Lista de Anime
          </h1>
          <Link
            href="/anime"
            className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus size={20} />
            Explorar más anime
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { value: 'all', label: 'Todos', count: statusCounts.all },
            { value: 'watching', label: 'Viendo', count: statusCounts.watching },
            { value: 'completed', label: 'Completados', count: statusCounts.completed },
            { value: 'plan-to-watch', label: 'Planeo ver', count: statusCounts['plan-to-watch'] },
            { value: 'on-hold', label: 'En pausa', count: statusCounts['on-hold'] },
            { value: 'dropped', label: 'Abandonados', count: statusCounts.dropped },
          ].map(({ value, label, count }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === value
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'glass-effect hover:shadow-md'
              }`}
            >
              {label} <span className="text-sm">({count})</span>
            </button>
          ))}
        </div>

        {/* Lista */}
        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : filteredList.length > 0 ? (
          <div className="grid gap-4">
            {filteredList.map((anime) => (
              <div
                key={anime._id}
                className="glass-effect p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{anime.animeId}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full font-medium">
                        {anime.status.replace('-', ' ')}
                      </span>
                      {anime.episodesWatched !== undefined && (
                        <span className="text-gray-600 dark:text-gray-400">
                          {anime.episodesWatched} episodios
                        </span>
                      )}
                      {anime.rating && (
                        <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                          <Star size={16} fill="currentColor" />
                          {anime.rating}/10
                        </span>
                      )}
                    </div>
                    {anime.notes && (
                      <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                        {anime.notes}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setEditingEntry(anime)}
                    className="flex items-center gap-2 px-4 py-2 glass-effect rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Edit size={18} />
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Play size={64} className="mx-auto mb-4 text-gray-400 opacity-50" />
            <h3 className="text-xl font-bold mb-2">No hay anime en esta categoría</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filter === 'all' 
                ? 'Comienza explorando y agregando anime a tu lista' 
                : 'Prueba con otro filtro o agrega más anime'}
            </p>
            <Link
              href="/anime"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus size={20} />
              Explorar anime
            </Link>
          </div>
        )}

        {/* Edit Modal */}
        {editingEntry && (
          <EditListModal
            isOpen={!!editingEntry}
            onClose={() => setEditingEntry(null)}
            onUpdate={(data) => handleUpdate(editingEntry._id, data)}
            onDelete={() => handleDelete(editingEntry._id)}
            title={editingEntry.animeId}
            type="anime"
            currentData={{
              status: editingEntry.status,
              rating: editingEntry.rating,
              progress: editingEntry.episodesWatched,
              notes: editingEntry.notes,
            }}
          />
        )}
      </div>
    </div>
  );
}
