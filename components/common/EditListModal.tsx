'use client';

import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';

interface EditListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: {
    status?: string;
    rating?: number;
    progress?: number;
    notes?: string;
  }) => Promise<void>;
  onDelete: () => Promise<void>;
  title: string;
  type: 'anime' | 'manga';
  currentData: {
    status: string;
    rating?: number;
    progress?: number;
    notes?: string;
  };
}

export default function EditListModal({
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  title,
  type,
  currentData,
}: EditListModalProps) {
  const [status, setStatus] = useState(currentData.status);
  const [rating, setRating] = useState(currentData.rating || 0);
  const [progress, setProgress] = useState(currentData.progress || 0);
  const [notes, setNotes] = useState(currentData.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const statusOptions = type === 'anime'
    ? [
        { value: 'watching', label: 'Viendo' },
        { value: 'completed', label: 'Completado' },
        { value: 'plan-to-watch', label: 'Planeo ver' },
        { value: 'on-hold', label: 'En pausa' },
        { value: 'dropped', label: 'Abandonado' },
      ]
    : [
        { value: 'reading', label: 'Leyendo' },
        { value: 'completed', label: 'Completado' },
        { value: 'plan-to-read', label: 'Planeo leer' },
        { value: 'on-hold', label: 'En pausa' },
        { value: 'dropped', label: 'Abandonado' },
      ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onUpdate({
        status,
        rating: rating > 0 ? rating : undefined,
        progress: progress > 0 ? progress : undefined,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await onDelete();
      onClose();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="glass-effect rounded-2xl max-w-md w-full p-6 animate-slide-in-right shadow-2xl">
        {showDeleteConfirm ? (
          // Delete Confirmation
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="text-red-600 dark:text-red-400" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">¿Eliminar de tu lista?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Esta acción no se puede deshacer
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 glass-effect rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Editar entrada</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                  {title}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Estado */}
              <div>
                <label className="block text-sm font-medium mb-2">Estado</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg glass-effect focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium mb-2">Calificación</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      className={`w-10 h-10 rounded-lg transition-all ${
                        value <= rating
                          ? 'bg-yellow-400 text-white scale-110'
                          : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <button
                    type="button"
                    onClick={() => setRating(0)}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mt-2"
                  >
                    Limpiar calificación
                  </button>
                )}
              </div>

              {/* Progreso */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {type === 'anime' ? 'Episodios vistos' : 'Capítulos leídos'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={progress}
                  onChange={(e) => setProgress(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 rounded-lg glass-effect focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Notas */}
              <div>
                <label className="block text-sm font-medium mb-2">Notas</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg glass-effect focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  rows={3}
                  placeholder="Escribe tus pensamientos..."
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {notes.length}/500 caracteres
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                  disabled={isSubmitting}
                >
                  <Trash2 size={20} />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 glass-effect rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
