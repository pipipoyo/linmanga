import Link from 'next/link';
import { Manga } from '@/types';

interface MangaCardProps {
    manga: Manga;
}

export default function MangaCard({ manga }: MangaCardProps) {
    return (
        <Link href={`/manga/${manga.id}`} className="group block w-full">
            <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-gray-100 mb-2">
                <img
                    src={manga.coverImage}
                    alt={manga.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
            <div>
                <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight mb-0.5 group-hover:text-line-green transition-colors">
                    {manga.title}
                </h3>
                <p className="text-xs text-gray-500 truncate">{manga.author}</p>
            </div>
        </Link>
    );
}
