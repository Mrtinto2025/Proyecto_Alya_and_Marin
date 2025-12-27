'use client';

import { useMemo, useState } from 'react';
import { Search, Filter, MessageSquare, Calendar, Tag } from 'lucide-react';

const POSTS = [
  {
    id: '1',
    title: 'Guía rápida para empezar con listas de anime y manga',
    author: 'Marin',
    date: '2024-11-12',
    tags: ['guía', 'listas'],
    category: 'guía',
    excerpt: 'Aprende a crear y organizar tus listas con puntuaciones, estados y notas personales.',
  },
  {
    id: '2',
    title: 'Discusión: Temporada de invierno, ¿qué esperas?',
    author: 'Alya',
    date: '2024-12-05',
    tags: ['discusión', 'temporada'],
    category: 'discusión',
    excerpt: 'Comparte qué estrenos te emocionan y qué continuaciones no te vas a perder.',
  },
  {
    id: '3',
    title: 'Top mangas infravalorados que debes leer',
    author: 'Komi',
    date: '2024-10-28',
    tags: ['recomendaciones', 'manga'],
    category: 'recomendaciones',
    excerpt: 'Selección de mangas poco conocidos con historias sólidas y arte destacable.',
  },
  {
    id: '4',
    title: 'Truco: Cómo usar mejor los filtros avanzados',
    author: 'Marin',
    date: '2024-09-15',
    tags: ['tips', 'filtros'],
    category: 'tips',
    excerpt: 'Saca partido a los filtros de género, estado y año para descubrir joyas ocultas.',
  },
];

const CATEGORIES = [
  { value: '', label: 'Todas las categorías' },
  { value: 'discusión', label: 'Discusión' },
  { value: 'guía', label: 'Guías' },
  { value: 'recomendaciones', label: 'Recomendaciones' },
  { value: 'tips', label: 'Tips' },
];

export default function CommunityPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const filtered = useMemo(() => {
    return POSTS.filter((post) => {
      const matchText = (post.title + post.excerpt + post.tags.join(' ')).toLowerCase().includes(search.toLowerCase());
      const matchCat = category ? post.category === category : true;
      return matchText && matchCat;
    });
  }, [search, category]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-4xl font-bold">Community</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Comparte discusiones, guías y recomendaciones con la comunidad.</p>
        </div>
      </section>

      <section className="py-8 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3 flex-1 bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700">
            <Search size={18} className="text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Busca por título, tag o autor"
              className="w-full bg-transparent outline-none text-gray-900 dark:text-gray-50"
            />
          </div>
          <div className="flex items-center gap-3">
            <Filter size={18} className="text-gray-500" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-50"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <button
            className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:opacity-90 transition"
            onClick={() => alert('Próximamente: crear post')}
          >
            Crear post
          </button>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p className="text-lg font-semibold">No hay publicaciones</p>
              <p className="text-sm">Prueba otro término o categoría</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filtered.map((post) => (
                <article key={post.id} className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-lg transition">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <Calendar size={14} />
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span>Por {post.author}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-300 mb-4">
                    {post.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-200">
                        <Tag size={12} /> {tag}
                      </span>
                    ))}
                  </div>
                  <button className="inline-flex items-center gap-2 text-secondary-500 hover:text-secondary-400 text-sm font-semibold">
                    <MessageSquare size={16} /> Abrir hilo
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
