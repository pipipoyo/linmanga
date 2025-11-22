import Link from 'next/link';
import { getMangaById } from '@/lib/db';
import { notFound } from 'next/navigation';
import DeleteMangaButton from '@/components/DeleteMangaButton';
import DeleteChapterButton from '@/components/DeleteChapterButton';
import { auth } from '@/auth';

interface Props {
    params: Promise<{
        id: string;
    }>;
}



export default async function MangaPage({ params }: Props) {
    const { id } = await params;
    const manga = await getMangaById(id);
    const session = await auth();

    if (!manga) {
        notFound();
    }

    const isOwner = session?.user?.email === manga.userId;

    return (
        <div className="pb-20 bg-white min-h-screen">
            {/* Header Area with Blurred Background */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gray-900">
                    <img
                        src={manga.coverImage}
                        alt=""
                        className="w-full h-full object-cover opacity-30 blur-xl scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
                </div>

                <div className="relative z-10 px-4 py-8 sm:py-12 max-w-4xl mx-auto flex flex-col sm:flex-row gap-6 items-center sm:items-end">
                    <div className="w-32 sm:w-48 flex-shrink-0 shadow-2xl rounded-md overflow-hidden">
                        <img
                            src={manga.coverImage}
                            alt={manga.title}
                            className="w-full h-auto object-cover aspect-[2/3]"
                        />
                    </div>
                    <div className="flex-1 text-center sm:text-left text-white">
                        <h1 className="text-2xl sm:text-4xl font-bold mb-2 leading-tight">{manga.title}</h1>
                        <p className="text-sm sm:text-lg opacity-90 mb-4">{manga.author}</p>
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-4">
                            <span className="px-2 py-0.5 border border-white/40 rounded text-xs">連載中</span>
                            <span className="px-2 py-0.5 border border-white/40 rounded text-xs">公式</span>
                            <span className="px-2 py-0.5 border border-white/40 rounded text-xs">金曜更新</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 justify-center sm:justify-start">
                            {manga.chapters.length > 0 ? (
                                <Link
                                    href={`/manga/${manga.id}/chapter/${manga.chapters[0].id}`}
                                    className="bg-line-green text-white font-bold py-3 px-8 rounded-full hover:bg-line-dark-green transition-colors shadow-lg"
                                >
                                    はじめから読む
                                </Link>
                            ) : (
                                <button disabled className="bg-gray-500 text-white font-bold py-3 px-8 rounded-full cursor-not-allowed opacity-70">
                                    準備中
                                </button>
                            )}

                            {isOwner && (
                                <>
                                    <Link
                                        href={`/manga/${manga.id}/edit`}
                                        className="bg-white/20 backdrop-blur-sm text-white font-bold py-3 px-4 rounded-full hover:bg-white/30 transition-colors"
                                    >
                                        編集
                                    </Link>
                                    <div className="bg-white/20 backdrop-blur-sm rounded-full flex items-center">
                                        <DeleteMangaButton id={manga.id} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs (Mock) */}
            <div className="sticky top-14 z-40 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-4xl mx-auto flex">
                    <button className="flex-1 py-3 text-sm font-bold text-line-green border-b-2 border-line-green">
                        一覧
                    </button>
                    <button className="flex-1 py-3 text-sm font-bold text-gray-500 hover:text-gray-800">
                        詳細
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* Description (Details Tab Content - simplified here) */}
                <div className="mb-8 text-sm text-gray-700 leading-relaxed">
                    {manga.description}
                </div>

                {/* Chapter List */}
                <div className="mb-4 flex justify-between items-center">
                    <h2 className="font-bold text-lg">エピソード ({manga.chapters.length})</h2>
                    {isOwner && (
                        <Link
                            href={`/manga/${manga.id}/upload`}
                            className="text-xs font-bold text-line-green border border-line-green px-3 py-1 rounded-full hover:bg-green-50"
                        >
                            + 追加
                        </Link>
                    )}
                </div>

                <div className="space-y-0 divide-y divide-gray-100">
                    {manga.chapters.map((chapter, index) => (
                        <div key={chapter.id} className="py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                            <Link href={`/manga/${manga.id}/chapter/${chapter.id}`} className="block w-24 sm:w-32 aspect-video bg-gray-200 rounded overflow-hidden flex-shrink-0 relative">
                                {/* Thumbnail placeholder */}
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
                                    No Image
                                </div>
                            </Link>
                            <div className="flex-1 min-w-0">
                                <Link href={`/manga/${manga.id}/chapter/${chapter.id}`} className="block">
                                    <h3 className="font-bold text-gray-900 truncate mb-1">{chapter.title}</h3>
                                    <p className="text-xs text-gray-500">2023.11.22</p>
                                </Link>
                            </div>
                            <div className="flex-shrink-0 flex items-center gap-2">
                                <Link
                                    href={`/manga/${manga.id}/chapter/${chapter.id}`}
                                    className="px-4 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-full hover:bg-gray-200"
                                >
                                    読む
                                </Link>
                                {isOwner && <DeleteChapterButton mangaId={manga.id} chapterId={chapter.id} />}
                            </div>
                        </div>
                    ))}

                    {manga.chapters.length === 0 && (
                        <div className="py-10 text-center text-gray-500 text-sm">
                            まだエピソードがありません
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
