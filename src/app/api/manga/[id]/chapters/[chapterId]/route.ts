import { NextResponse } from 'next/server';
import { deleteChapter, getMangaById } from '@/lib/db';
import { auth } from '@/auth';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id, chapterId } = await params;
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

        await deleteChapter(id, chapterId);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete chapter:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
