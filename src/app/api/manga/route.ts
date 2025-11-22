import { NextResponse } from 'next/server';
import { getMangaList, saveManga } from '@/lib/db';
import { Manga } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '@/auth';

export async function GET() {
    const mangaList = await getMangaList();
    return NextResponse.json(mangaList);
}

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { title, author, description, coverImage } = body;

        if (!title || !author || !description || !coverImage) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const newManga: Manga = {
            id: uuidv4(),
            title,
            author,
            description,
            coverImage,
            chapters: [], // Initially empty
            userId: session.user.email, // Store user email as userId
        };

        await saveManga(newManga);

        return NextResponse.json(newManga, { status: 201 });
    } catch (error) {
        console.error('Failed to create manga:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
