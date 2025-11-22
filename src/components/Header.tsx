import Link from 'next/link';
import { auth, signOut } from '@/auth';

export default async function Header() {
    const session = await auth();

    return (
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-line-green font-bold text-xl tracking-tighter">
                        piyomanga
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 text-gray-600 hover:text-gray-900">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </button>

                    {session ? (
                        <>
                            {(session.user as any)?.role === 'admin' && (
                                <Link href="/admin" className="p-2 text-gray-600 hover:text-gray-900" title="管理者メニュー">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                                    </svg>
                                </Link>
                            )}
                            <Link href="/upload" className="p-2 text-gray-600 hover:text-gray-900" title="アップロード">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </Link>
                            <form
                                action={async () => {
                                    'use server';
                                    await signOut();
                                }}
                            >
                                <button
                                    type="submit"
                                    className="text-xs font-bold text-gray-500 hover:text-gray-900 ml-2 border border-gray-300 rounded px-2 py-1"
                                >
                                    ログアウト
                                </button>
                            </form>
                        </>
                    ) : (
                        <Link href="/login" className="text-sm font-bold text-gray-900">
                            ログイン
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
