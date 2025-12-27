import { Star } from 'lucide-react';

export default function Rating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1 text-yellow-500">
      <Star size={16} />
      <span className="text-sm font-semibold">{value.toFixed(1)}</span>
    </div>
  );
}
