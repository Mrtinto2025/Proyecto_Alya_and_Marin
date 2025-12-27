import Link from 'next/link';
import { Heart, Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="glass-effect border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent mb-2">
              Alya & Marin Hub
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tu portal definitivo para descubrir, explorar y compartir tu pasión por el anime y manga.
            </p>
            <div className="flex items-center space-x-4 mt-4">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-3">Navegación</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/anime" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                  Anime
                </Link>
              </li>
              <li>
                <Link href="/manga" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                  Manga
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                  Términos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
            Hecho con <Heart size={16} className="text-red-500" fill="currentColor" /> por un fan del anime
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            © 2025 Alya & Marin Hub. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
