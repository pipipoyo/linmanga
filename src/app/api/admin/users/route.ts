import { NextResponse } from 'next/server';
import { getUsers } from '@/lib/auth-db';
import { auth } from '@/auth';

export async function GET() {
    try {
        const session = await auth();
        if ((session?.user as any)?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const users = await getUsers();
        // Remove passwords from response
        const safeUsers = users.map(({ password, ...user }) => user);

        return NextResponse.json(safeUsers);
    } catch (error) {
        console.error('Failed to fetch users:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
