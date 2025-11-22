export interface Chapter {
  id: string;
  number: number;
  title: string;
  content: string[];
}

export interface Manga {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  chapters: Chapter[];
  userId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role?: 'admin' | 'user';
}
