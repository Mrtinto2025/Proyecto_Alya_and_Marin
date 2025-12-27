import Image from 'next/image';
import Rating from '@/components/common/Rating';
import { MangaItem } from '@/lib/types';

export default function MangaCard({ item }: { item: MangaItem }) {
  return (
    <div className="glass-effect rounded-xl overflow-hidden card-hover">
      <div className="relative aspect-[3/4]">
        <Image
          src={item.coverImage}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <h3 className="text-sm font-semibold line-clamp-2">{item.title}</h3>
        </div>
      </div>
      <div className="p-3 flex items-center justify-between">
        <Rating value={item.rating} />
        <div className="flex gap-2">
          {item.genres.slice(0, 2).map((g) => (
            <span key={g} className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {g}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
