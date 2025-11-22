"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteMangaButton({ id }: { id: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm('本当にこの漫画を削除しますか？この操作は取り消せません。')) {
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/manga/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Delete failed');
            }

            router.push('/');
            router.refresh();
        } catch (error) {
            console.error('Error deleting manga:', error);
            alert('削除に失敗しました');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm disabled:opacity-50"
        >
            {loading ? '削除中...' : '削除'}
        </button>
    );
}
