'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMangaList } from '@/hooks/useMangaList';
import { useToast } from '@/components/common/Toast';
import { BookOpen, Plus, Edit, Star } from 'lucide-react';
import EditListModal from '@/components/common/EditListModal';
import Link from 'next/link';

export default function MyMangaListPage() {
  const { requireAuth } = useAuth();
  const { mangaList, isLoading, updateManga, deleteManga } = useMangaList();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<string>('all');
  const [editingEntry, setEditingEntry] = useState<any>(null);

  useEffect(() => {
    requireAuth();
  }, []);

  const filteredList = filter === 'all' 
    ? mangaList 
    : mangaList.filter(m => m.status === filter);

  const handleUpdate = async (id: string, data: any) => {
    const result = await updateManga(id, data);
    if (result.success) {
      showToast('Manga actualizado exitosamente', 'success');
    } else {
      showToast(result.error || 'Error al actualizar', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteManga(id);
    if (result.success) {
      showToast('Manga eliminado de tu lista', 'success');
    } else {
      showToast(result.error || 'Error al eliminar', 'error');
    }
  };

  const statusCounts = {
    all: mangaList.length,
    reading: mangaList.filter(m => m.status === 'reading').length,
    completed: mangaList.filter(m => m.status === 'completed').length,
    'plan-to-read': mangaList.filter(m => m.status === 'plan-to-read').length,
    'on-hold': mangaList.filter(m => m.status === 'on-hold').length,
    dropped: mangaList.filter(m => m.status === 'dropped').length,
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <BookOpen className="text-secondary-500" />
            Mi Lista de Manga
          </h1>
          <Link
            href="/manga"
            className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus size={20} />
            Explorar más manga
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { value: 'all', label: 'Todos', count: statusCounts.all },
            { value: 'reading', label: 'Leyendo', count: statusCounts.reading },
            { value: 'completed', label: 'Completados', count: statusCounts.completed },
            { value: 'plan-to-read', label: 'Planeo leer', count: statusCounts['plan-to-read'] },
            { value: 'on-hold', label: 'En pausa', count: statusCounts['on-hold'] },
            { value: 'dropped', label: 'Abandonados', count: statusCounts.dropped },
          ].map(({ value, label, count }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === value
                  ? 'bg-secondary-500 text-white shadow-lg'
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
            {filteredList.map((manga) => (
              <div
                key={manga._id}
                className="glass-effect p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{manga.mangaId}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="px-3 py-1 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 rounded-full font-medium">
                        {manga.status.replace('-', ' ')}
                      </span>
                      {manga.chaptersRead !== undefined && (
                        <span className="text-gray-600 dark:text-gray-400">
                          {manga.chaptersRead} capítulos
                        </span>
                      )}
                      {manga.rating && (
                        <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                          <Star size={16} fill="currentColor" />
                          {manga.rating}/10
                        </span>
                      )}
                    </div>
                    {manga.notes && (
                      <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                        {manga.notes}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setEditingEntry(manga)}
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
            <BookOpen size={64} className="mx-auto mb-4 text-gray-400 opacity-50" />
            <h3 className="text-xl font-bold mb-2">No hay manga en esta categoría</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filter === 'all' 
                ? 'Comienza explorando y agregando manga a tu lista' 
                : 'Prueba con otro filtro o agrega más manga'}
            </p>
            <Link
              href="/manga"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus size={20} />
              Explorar manga
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
            title={editingEntry.mangaId}
            type="manga"
            currentData={{
              status: editingEntry.status,
              rating: editingEntry.rating,
              progress: editingEntry.chaptersRead,
              notes: editingEntry.notes,
            }}
          />
        )}
      </div>
    </div>
  );
}
