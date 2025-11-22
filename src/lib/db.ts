import { prisma } from '@/lib/prisma';
import { Manga } from '@/types';

export async function getMangaList(): Promise<Manga[]> {
    const mangas = await prisma.manga.findMany({
        include: {
            chapters: {
                include: {
                    pages: {
                        orderBy: {
                            pageNumber: 'asc',
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return mangas.map(manga => ({
        ...manga,
        chapters: manga.chapters.map(chapter => ({
            ...chapter,
            content: chapter.content ? [chapter.content] : [],
            pages: chapter.pages.map(page => page.imageUrl),
            number: 0,
        })),
    })) as unknown as Manga[];
}

export async function saveManga(manga: Manga): Promise<void> {
    const { id, title, author, description, coverImage, userId } = manga;

    await prisma.manga.create({
        data: {
            id,
            title,
            author,
            description,
            coverImage,
            userId,
        },
    });
}

export async function getMangaById(id: string): Promise<Manga | undefined> {
    const manga = await prisma.manga.findUnique({
        where: { id },
        include: {
            chapters: {
                orderBy: {
                    createdAt: 'asc',
                },
                include: {
                    pages: {
                        orderBy: {
                            pageNumber: 'asc',
                        },
                    },
                },
            },
        },
    });

    if (!manga) return undefined;

    return {
        ...manga,
        chapters: manga.chapters.map(chapter => ({
            ...chapter,
            content: chapter.content ? [chapter.content] : [],
            pages: chapter.pages.map(page => page.imageUrl),
            number: 0,
        })),
    } as unknown as Manga;
}

export async function addChapterToManga(mangaId: string, chapter: any): Promise<void> {
    await prisma.chapter.create({
        data: {
            id: chapter.id,
            title: chapter.title,
            content: chapter.content,
            mangaId: mangaId,
        },
    });
}

export async function updateManga(id: string, data: Partial<Manga>): Promise<void> {
    const { chapters, ...updateData } = data;

    await prisma.manga.update({
        where: { id },
        data: updateData,
    });
}

export async function deleteManga(id: string): Promise<void> {
    await prisma.manga.delete({
        where: { id },
    });
}

export async function deleteChapter(mangaId: string, chapterId: string): Promise<void> {
    await prisma.chapter.delete({
        where: { id: chapterId },
    });
}
