import { NextResponse } from 'next/server';
import { updateManga, deleteManga, getMangaById } from '@/lib/db';
import { auth } from '@/auth';

export async function PUT(
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
        const { title, author, description, coverImage } = body;

        await updateManga(id, { title, author, description, coverImage });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to update manga:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
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

        await deleteManga(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete manga:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
