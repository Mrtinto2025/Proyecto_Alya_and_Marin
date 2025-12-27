import Link from 'next/link';
import { Search, Filter, Star } from 'lucide-react';
import CardGrid from '@/components/common/CardGrid';
import AnimeCard from '@/components/anime/AnimeCard';
import { animeMock } from '@/data/anime';

export const metadata = {
  title: 'Anime Explorer | Alya & Marin Hub',
  description: 'Explora y descubre animes con filtros y recomendaciones.',
};

export default function AnimePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-4xl font-bold">Anime Explorer</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Busca, filtra y organiza tus animes favoritos.
          </p>
        </div>
      </section>

      {/* Search + Filters (placeholder) */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 glass-effect p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <Search size={20} className="text-gray-500" />
                <input
                  placeholder="Busca por título, estudio, género..."
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>
            <div className="glass-effect p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <Filter size={20} className="text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Filtros avanzados (próximamente)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Star className="text-yellow-500" /> Tendencias de la temporada
            </h2>
            <Link href="#" className="text-primary-500 hover:text-primary-600">Ver todos</Link>
          </div>
          <CardGrid>
            {animeMock.map((item) => (
              <AnimeCard key={item.id} item={item} />
            ))}
          </CardGrid>
        </div>
      </section>
    </div>
  );
}
