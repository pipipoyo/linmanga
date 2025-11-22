import { prisma } from '@/lib/prisma';
import { Manga } from '@/types';

// Helper to map Prisma result to Manga type if needed, 
// but Prisma types should be close enough. 
// However, Prisma returns Date objects for createdAt/updatedAt, 
// while JSON might have had strings or the type definition might expect something else.
// Let's assume the Manga type in @/types is compatible or we might need to adjust.
// Actually, let's check @/types later if there are issues.

export async function getMangaList(): Promise<Manga[]> {
    const mangas = await prisma.manga.findMany({
        include: {
            chapters: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return mangas as unknown as Manga[];
}

export async function saveManga(manga: Manga): Promise<void> {
    // Prisma create expects data without 'id' if it's auto-generated, 
    // but our Manga type has 'id'. We can pass it if we want to enforce it.
    // Also, 'chapters' in Manga type is an array, but in Prisma create it's a relation.
    // We should separate chapter creation or handle nested write.
    // For now, assuming saveManga is used for creating a new manga with empty chapters.

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
                    createdAt: 'asc', // or by chapter number if we had it
                },
            },
        },
    });
    return manga as unknown as Manga | undefined;
}

export async function addChapterToManga(mangaId: string, chapter: any): Promise<void> {
    // chapter object from frontend might have id, title, content.
    // We need to ensure it matches Prisma Chapter create input.

    await prisma.chapter.create({
        data: {
            id: chapter.id, // Use provided ID or let Prisma generate? 
            // The previous code generated ID: `c${list[mangaIndex].chapters.length + 1}`
            // But here we should probably use UUIDs. 
            // If the caller provides an ID (like uuidv4), use it.
            title: chapter.title,
            content: chapter.content,
            mangaId: mangaId,
        },
    });
}

export async function updateManga(id: string, data: Partial<Manga>): Promise<void> {
    // Remove chapters from data if present, as updateManga usually updates metadata
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
