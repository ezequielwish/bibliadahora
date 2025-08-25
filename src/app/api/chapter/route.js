import crypto from "crypto";
import bibleData from "@/../public/data/nvi.json"; // Importa o JSON da Bíblia

// Gera uma seed baseada na hora atual (muda a cada hora)
function getCurrentHourSeed() {
    const now = new Date();
    return Math.floor(now.getTime() / (1000 * 60 * 60)); // Seed por hora
}

export async function GET() {
    const books = bibleData;

    // Gera um número a partir do hash da seed
    const seed = getCurrentHourSeed();
    const hash = crypto.createHash("sha256").update(String(seed)).digest("hex");
    const seedInt = parseInt(hash.substring(0, 8), 16);

    // Usa a seed para escolher um livro e um capítulo
    const book = books[seedInt % books.length];
    const chapterIndex = seedInt % book.chapters.length;
    const verses = book.chapters[chapterIndex];

    // Se o primeiro caractere do book.name for um numero, adiciona "º"
    // Exemplo: 1 Samuel -> 1º Samuel 
    if (!isNaN(book.name.charAt(0))) {
    book.name = book.name.charAt(0) + "º " + book.name.substring(1).trim();
}

    // Retorna os dados em formato JSON
    return Response.json({
        book: book.name,
        chapter: chapterIndex + 1,
        verses,
    });
}
