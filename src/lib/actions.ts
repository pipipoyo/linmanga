'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { createUser, getUserByEmail } from './auth-db';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', { ...Object.fromEntries(formData), redirectTo: '/' });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export async function register(
    prevState: string | undefined,
    formData: FormData,
) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !email || !password) {
        return 'All fields are required.';
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        return 'Email already exists.';
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await createUser({
        id: uuidv4(),
        name,
        email,
        password: hashedPassword,
    });

    try {
        await signIn('credentials', { ...Object.fromEntries(formData), redirectTo: '/' });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Something went wrong during auto-login.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}
