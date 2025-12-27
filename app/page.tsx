import Link from 'next/link';
import NextImage from 'next/image';
import { Sparkles, Search, BookOpen, Users, Image as ImageIcon } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-secondary-50 to-pink-50 dark:from-gray-900 dark:via-primary-900/20 dark:to-secondary-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Text */}
            <div className="space-y-6 animate-fade-in">
              <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full">
                <Sparkles className="text-primary-500" size={20} />
                <span className="text-sm font-medium">Bienvenido al Hub</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Descubre el mundo del{' '}
                <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                  Anime & Manga
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Con Alya y Marin como tus guías, explora miles de animes y mangas,
                conecta con otros fans y comparte tu creatividad.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-lg"
                >
                  Comenzar Ahora
                </Link>
                <Link
                  href="/anime"
                  className="px-8 py-4 glass-effect rounded-lg font-semibold hover:shadow-lg transition-shadow"
                >
                  Explorar Anime
                </Link>
              </div>
            </div>

            {/* Right side - Hero image */}
            <div className="relative animate-float hidden md:block">
              <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
                <NextImage
                  src="/images/gallery/alya-marin-playa.jpg"
                  alt="Alya y Marin"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 600px"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/30" />
                <div className="absolute bottom-4 right-4 bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg text-sm font-semibold text-gray-800 dark:text-gray-100">
                  Alya & Marin
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">¿Qué puedes hacer aquí?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Todo lo que necesitas en un solo lugar
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="glass-effect p-6 rounded-2xl card-hover">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center mb-4">
                <Search className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Explora Anime</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Busca y descubre miles de animes con filtros avanzados. Crea tu lista personalizada.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-effect p-6 rounded-2xl card-hover">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Lee Manga</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Catálogo completo de mangas con seguimiento de lectura y recomendaciones.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-effect p-6 rounded-2xl card-hover">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                <Users className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Comunidad</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Únete a discusiones, comparte reviews y conecta con otros fans.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass-effect p-6 rounded-2xl card-hover">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <ImageIcon className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Fan Art</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Sube y comparte tus dibujos con la comunidad. Inspírate con otros artistas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-secondary-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para comenzar tu aventura?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Únete a nuestra creciente comunidad de fans del anime y manga
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:shadow-2xl transition-shadow text-lg"
          >
            Crear Cuenta Gratis
          </Link>
        </div>
      </section>
    </div>
  );
}
