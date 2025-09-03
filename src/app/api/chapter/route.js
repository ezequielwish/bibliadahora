import crypto from "crypto";
import bibleData from "@/../public/data/nvi.json"; // Importa o JSON da Bíblia

// Gera uma seed baseada na hora e dia atual (muda a cada hora)
function getCurrentHourSeed() {
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const hour = now.getHours();
    return `${dateStr}-${hour}`;
}

export async function GET() {
    const books = bibleData;

    // Gera um número a partir do hash da seed
    const seed = getCurrentHourSeed();
    const hash = crypto.createHash("sha256").update(seed).digest("hex");
    const seedInt = parseInt(hash.substring(0, 8), 16);

    // Escolhe o livro e o capítulo
    const book = books[seedInt % books.length];
    const chapterIndex = seedInt % book.chapters.length;
    const verses = book.chapters[chapterIndex];

    // Se o primeiro caractere do book.name for um número, adiciona "º"
    if (!isNaN(book.name.charAt(0)) && !book.name.includes("º")) {
        book.name = book.name.charAt(0) + "º " + book.name.substring(1).trim();
    }

    // Cria um chapterId baseado na seed (muda a cada hora)
    const chapterId = `${book.name.replace(
        /\s+/g,
        "_"
    )}_${chapterIndex}_${seed}`;

    // Retorna os dados em formato JSON
    return Response.json({
        seed: seed,
        book: book.name,
        chapter: chapterIndex + 1,
        verses,
        chapterId,
    });
}
