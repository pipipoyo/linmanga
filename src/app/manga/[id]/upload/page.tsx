"use client";

import { useState, use } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ChapterUploadPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const [title, setTitle] = useState('');
    const [pages, setPages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [forbidden, setForbidden] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newPages: string[] = [];
            const fileReaders: Promise<void>[] = [];

            Array.from(files).forEach((file) => {
                const reader = new FileReader();
                const promise = new Promise<void>((resolve) => {
                    reader.onloadend = () => {
                        newPages.push(reader.result as string);
                        resolve();
                    };
                });
                reader.readAsDataURL(file);
                fileReaders.push(promise);
            });

            Promise.all(fileReaders).then(() => {
                setPages((prev) => [...prev, ...newPages]);
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pages.length === 0) {
            alert('ページ画像を選択してください');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`/api/manga/${id}/chapters`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    pages,
                }),
            });

            if (response.status === 403) {
                alert('このマンガにエピソードを追加する権限がありません');
                router.push(`/manga/${id}`);
                return;
            }

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            router.push(`/manga/${id}`);
            router.refresh();
        } catch (error) {
            console.error('Error uploading chapter:', error);
            alert('アップロードに失敗しました');
        } finally {
            setLoading(false);
        }
    };

    if (forbidden) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-2xl mx-auto px-4 text-center">
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">アクセス拒否</h1>
                        <p className="text-gray-700">このマンガにエピソードを追加する権限がありません。</p>
                        <button
                            onClick={() => router.push(`/manga/${id}`)}
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            マンガページに戻る
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
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">エピソードを追加</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                エピソードタイトル
                            </label>
                            <input
                                type="text"
                                id="title"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="例: 第1話 始まり"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 text-gray-900"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                ページ画像（複数選択可）
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 48 48"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                        >
                                            <span>ファイルを選択</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="sr-only"
                                                multiple
                                                accept="image/png, image/jpeg, image/webp"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                                </div>
                            </div>
                        </div>

                        {pages.length > 0 && (
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">選択されたページ: {pages.length}枚</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {pages.map((page, index) => (
                                        <img key={index} src={page} alt={`Page ${index + 1}`} className="h-24 w-full object-cover rounded-md" />
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {loading ? '送信中...' : '登録する'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
