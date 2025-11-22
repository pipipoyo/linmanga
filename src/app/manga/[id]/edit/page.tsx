"use client";

import { useState, useEffect, use } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Manga } from '@/types';

export default function EditMangaPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [forbidden, setForbidden] = useState(false);

    useEffect(() => {
        const fetchManga = async () => {
            try {
                // In a real app, we would have an API to get a single manga.
                // For now, we can reuse the list API or assume the data is passed.
                // Since we don't have a single item API for client-side yet (only server actions/utils),
                // let's just fetch the list and find it, or add a GET endpoint.
                // Actually, we do have getMangaById in db.ts but that's server side.
                // Let's assume we can't easily fetch it client side without a new API route.
                // Wait, we can just use the page props if this was a server component, but it's a client component for forms.
                // Let's add a GET handler to /api/manga/[id]/route.ts first? 
                // Or just fetch all and filter (inefficient but works for small JSON).
                // Let's try fetching all for now as it's faster to implement.

                // Better approach: Since we are in a client component, we can't import db.ts.
                // We should probably add a GET method to /api/manga/[id]/route.ts.
                // But for now, let's just fetch the main list and filter.
                const response = await fetch('/api/manga');
                if (!response.ok) throw new Error('Failed to fetch');
                const mangas: Manga[] = await response.json();
                const manga = mangas.find(m => m.id === id);

                if (manga) {
                    setTitle(manga.title);
                    setAuthor(manga.author);
                    setDescription(manga.description);
                    setCoverImage(manga.coverImage);
                } else {
                    alert('Manga not found');
                    router.push('/');
                }
            } catch (error) {
                console.error(error);
                alert('Error loading manga');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchManga();
        }
    }, [id, router]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!coverImage) {
            alert('表紙画像を選択してください');
            return;
        }

        setSaving(true);

        try {
            const response = await fetch(`/api/manga/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    author,
                    description,
                    coverImage,
                }),
            });

            if (response.status === 403) {
                alert('この漫画を編集する権限がありません');
                router.push(`/manga/${id}`);
                return;
            }

            if (!response.ok) {
                throw new Error('Update failed');
            }

            router.push(`/manga/${id}`);
            router.refresh();
        } catch (error) {
            console.error('Error updating manga:', error);
            alert('更新に失敗しました');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    if (forbidden) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-2xl mx-auto px-4 text-center">
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">アクセス拒否</h1>
                        <p className="text-gray-700">この漫画を編集する権限がありません。</p>
                        <button
                            onClick={() => router.push(`/manga/${id}`)}
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            漫画ページに戻る
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">漫画情報を編集</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                タイトル
                            </label>
                            <input
                                type="text"
                                id="title"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 text-gray-900"
                            />
                        </div>

                        <div>
                            <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                                作者名
                            </label>
                            <input
                                type="text"
                                id="author"
                                required
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 text-gray-900"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                あらすじ
                            </label>
                            <textarea
                                id="description"
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 text-gray-900"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                表紙画像
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    {coverImage ? (
                                        <img src={coverImage} alt="Preview" className="mx-auto h-48 object-contain" />
                                    ) : (
                                        <div className="text-gray-400">No image selected</div>
                                    )}
                                    <div className="flex text-sm text-gray-600 justify-center mt-2">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                        >
                                            <span>ファイルを変更</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="sr-only"
                                                accept="image/png, image/jpeg, image/gif, image/webp"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF, WEBP up to 10MB</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="bg-gray-200 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none"
                            >
                                キャンセル
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {saving ? '保存中...' : '変更を保存'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
