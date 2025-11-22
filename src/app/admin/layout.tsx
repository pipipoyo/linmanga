import Link from 'next/link';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white">
                <div className="p-6">
                    <h1 className="text-2xl font-bold">Admin Panel</h1>
                </div>
                <nav className="mt-6">
                    <Link
                        href="/admin"
                        className="block px-6 py-3 hover:bg-gray-800 transition-colors"
                    >
                        ダッシュボード
                    </Link>
                    <Link
                        href="/admin/users"
                        className="block px-6 py-3 hover:bg-gray-800 transition-colors"
                    >
                        ユーザー管理
                    </Link>
                    <Link
                        href="/admin/manga"
                        className="block px-6 py-3 hover:bg-gray-800 transition-colors"
                    >
                        マンガ管理
                    </Link>
                    <Link
                        href="/"
                        className="block px-6 py-3 mt-6 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                        サイトに戻る
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
