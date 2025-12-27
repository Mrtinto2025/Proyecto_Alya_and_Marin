'use client';

import { ExternalLink } from 'lucide-react';

interface MangaReadingLinksProps {
  mangaTitle: string;
  mangaId: number;
}

export default function MangaReadingLinks({ mangaTitle, mangaId }: MangaReadingLinksProps) {
  const platforms = [
    {
      name: 'AniList',
      icon: '🔗',
      url: `https://anilist.co/manga/${mangaId}`,
      description: 'Ver en AniList (con enlaces externos)',
      color: 'from-blue-500 to-purple-500',
    },
    {
      name: 'MyAnimeList',
      icon: '📚',
      url: `https://myanimelist.net/search/all?q=${encodeURIComponent(mangaTitle)}&type=manga`,
      description: 'Buscar en MAL',
      color: 'from-blue-600 to-blue-400',
    },
    {
      name: 'MangaDex',
      icon: '🌐',
      url: `https://mangadex.org/search?q=${encodeURIComponent(mangaTitle)}`,
      description: 'Lector web (Recomendado)',
      color: 'from-orange-500 to-red-500',
    },
    {
      name: 'Manganelo',
      icon: '📖',
      url: `https://manganelo.com/search/${encodeURIComponent(mangaTitle.replace(/\s+/g, '_'))}`,
      description: 'Catálogo amplio',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">¿Dónde leer este manga?</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Haz clic en cualquiera de estas opciones para encontrar el manga:</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {platforms.map((platform) => (
          <a
            key={platform.name}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-col justify-between p-4 rounded-lg bg-gradient-to-r ${platform.color} text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300`}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="flex items-center gap-2">
                <span className="text-2xl">{platform.icon}</span>
                {platform.name}
              </span>
              <ExternalLink size={16} />
            </div>
            <p className="text-xs opacity-90">{platform.description}</p>
          </a>
        ))}
      </div>

      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-xs text-blue-900 dark:text-blue-200">
          💡 <strong>Consejo:</strong> Si no encuentras el manga en uno, prueba con otro. Cada plataforma tiene catalogo diferente. MangaDex es ideal para lectura online en web.
        </p>
      </div>
    </div>
  );
}
