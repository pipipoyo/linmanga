"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
    mangaId: string;
    chapterId: string;
}

export default function DeleteChapterButton({ mangaId, chapterId }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm('本当にこのエピソードを削除しますか？')) {
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/manga/${mangaId}/chapters/${chapterId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Delete failed');
            }

            router.refresh();
        } catch (error) {
            console.error('Error deleting chapter:', error);
            alert('削除に失敗しました');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="text-xs text-red-500 hover:text-red-700 ml-4"
        >
            {loading ? '...' : '削除'}
        </button>
    );
}
