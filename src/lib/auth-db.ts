import { prisma } from '@/lib/prisma';
import { User } from '@/types';

export async function getUsers(): Promise<User[]> {
    const users = await prisma.user.findMany();
    return users as unknown as User[];
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
    const user = await prisma.user.findUnique({
        where: { email },
    });
    return user as unknown as User | undefined;
}

export async function createUser(user: User): Promise<void> {
    await prisma.user.create({
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role || 'user',
        },
    });
}

export async function deleteUser(id: string): Promise<void> {
    await prisma.user.delete({
        where: { id },
    });
}
