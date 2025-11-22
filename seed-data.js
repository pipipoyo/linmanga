const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const usersFilePath = path.join(__dirname, 'src', 'data', 'users.json');
const mangaFilePath = path.join(__dirname, 'src', 'data', 'manga.json');

function loadData(filePath) {
    if (!fs.existsSync(filePath)) {
        return [];
    }
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
}

function saveData(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

async function seed() {
    console.log('Seeding data...');

    // 1. Create User
    const users = loadData(usersFilePath);
    let user = users.find(u => u.email === 'nanobananapro@example.com');

    if (!user) {
        const hashedPassword = await bcrypt.hash('password', 10);
        user = {
            id: uuidv4(),
            name: 'nanobananapro',
            email: 'nanobananapro@example.com',
            password: hashedPassword,
            role: 'user'
        };
        users.push(user);
        saveData(usersFilePath, users);
        console.log('User "nanobananapro" created.');
    } else {
        console.log('User "nanobananapro" already exists.');
    }

    // 2. Create Manga
    const mangaList = loadData(mangaFilePath);
    let manga = mangaList.find(m => m.title === "Nanobanana's Adventure" && m.userId === user.id);

    if (!manga) {
        manga = {
            id: uuidv4(),
            title: "Nanobanana's Adventure",
            author: "nanobananapro",
            description: "The epic journey of a nano banana in a macro world.",
            coverImage: "https://placehold.co/400x600/00C300/white?text=Nano+Banana",
            userId: user.id,
            chapters: []
        };

        // 3. Add Chapters
        const chapters = [
            { id: uuidv4(), title: "Chapter 1: Awakening", content: "The banana woke up.", pages: [] },
            { id: uuidv4(), title: "Chapter 2: The Peel", content: "It was slippery.", pages: [] },
            { id: uuidv4(), title: "Chapter 3: Potassium Power", content: "Energy boost!", pages: [] }
        ];
        manga.chapters = chapters;

        mangaList.push(manga);
        saveData(mangaFilePath, mangaList);
        console.log('Manga "Nanobanana\'s Adventure" created with 3 chapters.');
    } else {
        console.log('Manga "Nanobanana\'s Adventure" already exists.');
    }

    console.log('Seeding completed.');
}

seed();
