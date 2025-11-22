import { NextResponse } from 'next/server';
import { addChapterToManga, getMangaById } from '@/lib/db';
import { auth } from '@/auth';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const manga = await getMangaById(id);

        if (!manga) {
            return NextResponse.json(
                { error: 'Manga not found' },
                { status: 404 }
            );
        }

        if (manga.userId !== session.user.email) {
            return NextResponse.json(
                { error: 'Forbidden: You do not own this manga' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { title, pages } = body;

        if (!title || !pages || !Array.isArray(pages) || pages.length === 0) {
            return NextResponse.json(
                { error: 'Missing required fields or invalid pages' },
                { status: 400 }
            );
        }

        await addChapterToManga(id, { title, pages });

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error('Failed to add chapter:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
