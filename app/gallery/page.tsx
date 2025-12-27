'use client';

import { useMemo, useState } from 'react';
import { Search, Filter, Camera, Heart } from 'lucide-react';
import Image from 'next/image';

const ITEMS = [
  {
    id: '1',
    title: 'Alya & Marin en la playa',
    author: 'Fan Artist',
    tags: ['fanart', 'verano'],
    type: 'fanart',
    src: '/images/gallery/alya-marin-playa.jpg',
    width: 526,
    height: 935,
  },
  {
    id: '2',
    title: 'Póster minimal',
    author: 'Studio A&M',
    tags: ['wallpaper', 'poster'],
    type: 'wallpaper',
    src: '/images/gallery/poster-01.jpg',
    width: 1200,
    height: 1600,
  },
  {
    id: '3',
    title: 'Boceto a lápiz',
    author: 'Artist S',
    tags: ['boceto'],
    type: 'boceto',
    src: '/images/gallery/sketch-01.jpg',
    width: 900,
    height: 1200,
  },
];

const TYPES = [
  { value: '', label: 'Todos' },
  { value: 'fanart', label: 'Fanart' },
  { value: 'wallpaper', label: 'Wallpaper' },
  { value: 'boceto', label: 'Boceto' },
];

export default function GalleryPage() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');

  const filtered = useMemo(() => {
    return ITEMS.filter((item) => {
      const matchText = (item.title + item.author + item.tags.join(' ')).toLowerCase().includes(search.toLowerCase());
      const matchType = type ? item.type === type : true;
      return matchText && matchType;
    });
  }, [search, type]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-4xl font-bold">Gallery</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Explora fanarts, bocetos y wallpapers de la comunidad.</p>
        </div>
      </section>

      <section className="py-8 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3 flex-1 bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700">
            <Search size={18} className="text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Busca por título, autor o tag"
              className="w-full bg-transparent outline-none text-gray-900 dark:text-gray-50"
            />
          </div>
          <div className="flex items-center gap-3">
            <Filter size={18} className="text-gray-500" />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-50"
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <button
            className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:opacity-90 transition"
            onClick={() => alert('Próximamente: subir imagen')}
          >
            Subir imagen
          </button>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p className="text-lg font-semibold">No hay imágenes</p>
              <p className="text-sm">Prueba otro término o tipo</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item) => (
                <div key={item.id} className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 shadow-sm hover:shadow-lg transition">
                  <div className="relative w-full aspect-[3/4] overflow-hidden">
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Camera size={14} />
                      <span>{item.author}</span>
                    </div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-300">
                      {item.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 rounded-full bg-secondary-100 dark:bg-secondary-900/40 text-secondary-700 dark:text-secondary-200">{tag}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs uppercase text-gray-500 dark:text-gray-400">{item.type}</span>
                      <button className="inline-flex items-center gap-1 text-secondary-500 hover:text-secondary-400 text-sm font-semibold">
                        <Heart size={16} /> Me gusta
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
