'use client';

import { ExternalLink, Play } from 'lucide-react';

type StreamingPlatform = {
  name: string;
  url: string;
  logo: string;
  color: string;
  available: boolean;
};

interface StreamingLinksProps {
  animeTitle: string;
  animeId: number;
}

// Plataformas populares con búsqueda directa
const platforms: Omit<StreamingPlatform, 'url' | 'available'>[] = [
  {
    name: 'Crunchyroll',
    logo: 'https://static.crunchyroll.com/cxmega/assets/cr-logo-sm.png',
    color: 'from-orange-500 to-orange-600',
  },
  {
    name: 'Netflix',
    logo: 'https://www.netflix.com/favicon.ico',
    color: 'from-red-600 to-red-700',
  },
  {
    name: 'Prime Video',
    logo: 'https://www.primevideo.com/favicon.ico',
    color: 'from-blue-500 to-blue-600',
  },
  {
    name: 'Funimation',
    logo: 'https://www.funimation.com/favicon.ico',
    color: 'from-purple-600 to-purple-700',
  },
  {
    name: 'Hulu',
    logo: 'https://www.hulu.com/favicon.ico',
    color: 'from-green-500 to-green-600',
  },
];

export default function StreamingLinks({ animeTitle, animeId }: StreamingLinksProps) {
  const searchUrls: Record<string, string> = {
    Crunchyroll: `https://www.crunchyroll.com/search?q=${encodeURIComponent(animeTitle)}`,
    Netflix: `https://www.netflix.com/search?q=${encodeURIComponent(animeTitle)}`,
    'Prime Video': `https://www.primevideo.com/search?phrase=${encodeURIComponent(animeTitle)}`,
    Funimation: `https://www.funimation.com/search/?q=${encodeURIComponent(animeTitle)}`,
    Hulu: `https://www.hulu.com/search?q=${encodeURIComponent(animeTitle)}`,
  };

  const handlePlatformClick = (platformName: string) => {
    const url = searchUrls[platformName];
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Play className="text-indigo-500" size={24} />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">¿Dónde ver?</h3>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
        Busca este anime en las siguientes plataformas legales:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {platforms.map((platform) => (
          <button
            key={platform.name}
            onClick={() => handlePlatformClick(platform.name)}
            className="group relative overflow-hidden rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-200 dark:bg-white/10 flex items-center justify-center">
                <ExternalLink className="text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" size={20} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-900 dark:text-white font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {platform.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400">
                  Buscar anime
                </p>
              </div>
            </div>
            
            {/* Gradient hover effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${platform.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
          </button>
        ))}
      </div>

      <div className="mt-4 p-3 bg-yellow-50 dark:bg-gray-900/50 rounded-lg border border-yellow-200 dark:border-gray-700/50">
        <p className="text-xs text-gray-700 dark:text-gray-400 flex items-start gap-2">
          <span className="text-yellow-500 flex-shrink-0">💡</span>
          <span>
            Te redirigiremos a la búsqueda en cada plataforma. Algunas requieren suscripción.
            Apoya a los creadores viendo contenido legal.
          </span>
        </p>
      </div>
    </div>
  );
}
