import MangaCard from '@/components/MangaCard';
import Link from 'next/link';
import { getMangaList } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const mangaList = await getMangaList();
  const featuredManga = mangaList.slice(0, 5); // Top 5 for carousel/featured
  const newManga = mangaList.slice().reverse().slice(0, 6); // Newest 6
  const rankingManga = mangaList.slice(0, 6); // Mock ranking

  return (
    <div className="pb-20">
      {/* Hero Carousel (Mock) */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-gray-900 overflow-hidden mb-8">
        {featuredManga[0] && (
          <div className="absolute inset-0">
            <img
              src={featuredManga[0].coverImage}
              alt="Featured"
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <span className="inline-block px-2 py-1 bg-line-green text-xs font-bold rounded mb-2">
                おすすめ
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold mb-2">{featuredManga[0].title}</h2>
              <p className="text-sm sm:text-base opacity-90 line-clamp-2 max-w-2xl">
                {featuredManga[0].description}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-10">
        {/* New Arrivals Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">新着マンガ</h2>
            <Link href="/new" className="text-xs text-gray-500 hover:text-line-green">
              もっと見る &gt;
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
            {newManga.map((manga) => (
              <MangaCard key={manga.id} manga={manga} />
            ))}
          </div>
        </section>

        {/* Ranking Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">ランキング</h2>
            <Link href="/ranking" className="text-xs text-gray-500 hover:text-line-green">
              もっと見る &gt;
            </Link>
          </div>
          <div className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4 scrollbar-hide">
            {rankingManga.map((manga, index) => (
              <div key={manga.id} className="flex-none w-28 sm:w-32 relative">
                <div className="absolute top-0 left-0 w-6 h-6 bg-black/60 text-white text-xs font-bold flex items-center justify-center rounded-tl-md z-10">
                  {index + 1}
                </div>
                <MangaCard manga={manga} />
              </div>
            ))}
          </div>
        </section>

        {/* All Manga Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">すべてのマンガ</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
            {mangaList.map((manga) => (
              <MangaCard key={manga.id} manga={manga} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
