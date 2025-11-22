import { NextResponse } from 'next/server';
import { getUsers } from '@/lib/auth-db';
import { getMangaList } from '@/lib/db';
import { auth } from '@/auth';

export async function GET() {
    try {
        const session = await auth();
        if ((session?.user as any)?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const users = await getUsers();
        const mangaList = await getMangaList();

        return NextResponse.json({
            userCount: users.length,
            mangaCount: mangaList.length,
        });
    } catch (error) {
        console.error('Failed to fetch stats:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
