"use client";

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
    const [stats, setStats] = useState<{ userCount: number; mangaCount: number } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/admin/stats');
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">ダッシュボード</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">総ユーザー数</h3>
                    <p className="text-4xl font-bold text-blue-600">{stats?.userCount ?? 0}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">総マンガ数</h3>
                    <p className="text-4xl font-bold text-green-600">{stats?.mangaCount ?? 0}</p>
                </div>
            </div>
        </div>
    );
}
