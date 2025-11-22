import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            console.log('Middleware authorized check:', { isLoggedIn, path: nextUrl.pathname, user: auth?.user });

            const isOnDashboard = nextUrl.pathname.startsWith('/upload') || nextUrl.pathname.includes('/edit');
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');

            if (isOnAdmin) {
                if (isLoggedIn && (auth?.user as any)?.role === 'admin') return true;
                return false; // Redirect unauthenticated or non-admin users to login page (or 403 if logged in but not admin, but middleware redirect is simpler)
            }

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).role = token.role;
            }
            return session;
        },
    },
    providers: [], // Add providers with an empty array for now
    secret: 'cdfaa07948f9385d4fde7c04768dceb1d289071636cda2eed4221b1eba00ceb85',
} satisfies NextAuthConfig;
