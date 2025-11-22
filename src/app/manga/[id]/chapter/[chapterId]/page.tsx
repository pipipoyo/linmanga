import Link from 'next/link';
import { getMangaById } from '@/lib/db';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{
        id: string;
        chapterId: string;
    }>;
}

export default async function ChapterPage({ params }: Props) {
    const { id, chapterId } = await params;
    const manga = await getMangaById(id);
    const chapter = manga?.chapters.find((c) => c.id === chapterId);

    if (!manga || !chapter) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <header className="bg-gray-800 p-4 sticky top-0 z-10 shadow-md">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-lg font-semibold truncate">
                        {manga.title} - {chapter.title}
                    </h1>
                    <Link
                        href={`/manga/${manga.id}`}
                        className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition-colors"
                    >
                        一覧に戻る
                    </Link>
                </div>
            </header>
            <main className="max-w-4xl mx-auto py-8 px-4">
                <div className="flex flex-col items-center space-y-4">
                    {chapter.pages.map((page, index) => (
                        <img
                            key={index}
                            src={page}
                            alt={`Page ${index + 1}`}
                            className="max-w-full h-auto shadow-lg"
                            loading="lazy"
                        />
                    ))}
                </div>
                <div className="mt-12 text-center">
                    <p className="text-gray-400 mb-4">この話はこれで終わりです。</p>
                    <Link
                        href={`/manga/${manga.id}`}
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
                    >
                        次の話へ（未実装）
                    </Link>
                </div>
            </main>
        </div>
    );
}
