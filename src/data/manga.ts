import { Manga } from '@/types';

export const MOCK_MANGA: Manga[] = [
    {
        id: '1',
        title: '冒険の始まり',
        author: '山田 太郎',
        description: '勇者が魔王を倒すために旅に出る物語。',
        coverImage: 'https://placehold.co/400x600/png?text=Adventure',
        chapters: [
            {
                id: 'c1',
                title: '第1話 旅立ち',
                number: 1,
                pages: [
                    'https://placehold.co/600x800/png?text=Page+1',
                    'https://placehold.co/600x800/png?text=Page+2',
                    'https://placehold.co/600x800/png?text=Page+3',
                ],
            },
        ],
    },
    {
        id: '2',
        title: '日常の風景',
        author: '鈴木 花子',
        description: 'とある街の日常を描いたほのぼのストーリー。',
        coverImage: 'https://placehold.co/400x600/png?text=Daily+Life',
        chapters: [
            {
                id: 'c1',
                title: '第1話 朝のコーヒー',
                number: 1,
                pages: [
                    'https://placehold.co/600x800/png?text=Page+1',
                    'https://placehold.co/600x800/png?text=Page+2',
                ],
            },
        ],
    },
];
