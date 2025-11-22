const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding data...');

    // 1. Create User
    const email = 'nanobananapro@example.com';
    let user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        const hashedPassword = await bcrypt.hash('password', 10);
        user = await prisma.user.create({
            data: {
                name: 'nanobananapro',
                email: email,
                password: hashedPassword,
                role: 'user',
            },
        });
        console.log('User "nanobananapro" created.');
    } else {
        console.log('User "nanobananapro" already exists.');
    }

    // 2. Create Admin User
    const adminEmail = 'test@example.com';
    let adminUser = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (!adminUser) {
        const hashedPassword = await bcrypt.hash('password', 10);
        adminUser = await prisma.user.create({
            data: {
                name: 'Test Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
            },
        });
        console.log('User "test@example.com" (admin) created.');
    }

    // 3. Create Manga
    const mangaTitle = "Nanobanana's Adventure";
    let manga = await prisma.manga.findFirst({
        where: {
            title: mangaTitle,
            userId: user.id
        },
    });

    if (!manga) {
        manga = await prisma.manga.create({
            data: {
                title: mangaTitle,
                author: "nanobananapro",
                description: "The epic journey of a nano banana in a macro world.",
                coverImage: "https://placehold.co/400x600/00C300/white?text=Nano+Banana",
                userId: user.id,
                chapters: {
                    create: [
                        { title: "Chapter 1: Awakening", content: "The banana woke up." },
                        { title: "Chapter 2: The Peel", content: "It was slippery." },
                        { title: "Chapter 3: Potassium Power", content: "Energy boost!" }
                    ]
                }
            },
        });
        console.log('Manga "Nanobanana\'s Adventure" created with 3 chapters.');
    } else {
        console.log('Manga "Nanobanana\'s Adventure" already exists.');
    }

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
