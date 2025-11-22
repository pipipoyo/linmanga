"use client";

import { useEffect, useState } from 'react';
import { Manga } from '@/types';
import Link from 'next/link';

export default function AdminMangaPage() {
    const [mangaList, setMangaList] = useState<Manga[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchManga = async () => {
        try {
            const response = await fetch('/api/manga');
            if (response.ok) {
                const data = await response.json();
                setMangaList(data);
            }
        } catch (error) {
            console.error('Failed to fetch manga:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchManga();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('本当にこのマンガを削除しますか？（この操作は取り消せません）')) return;

        try {
            const response = await fetch(`/api/admin/manga/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('マンガを削除しました');
                fetchManga();
            } else {
                alert('削除に失敗しました');
            }
        } catch (error) {
            console.error('Failed to delete manga:', error);
            alert('エラーが発生しました');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">マンガ管理</h2>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">タイトル</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作者</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">所有者ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">エピソード数</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {mangaList.map((manga) => (
                            <tr key={manga.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    <Link href={`/manga/${manga.id}`} className="hover:text-blue-600">
                                        {manga.title}
                                    </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{manga.author}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{manga.userId || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{manga.chapters.length}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleDelete(manga.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        削除
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
