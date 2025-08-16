"use client";
import { useEffect, useState } from "react";
import livro from "@/assets/livro.jpg";

// Tipo para os dados do capítulo
type Chapter = {
    book: string;
    chapter: number;
    verses: string[];
};

// Tipo para os dados do resumo
type SummaryResponse = {
    summary: string;
};

export default function Home() {
    const [chapterData, setChapterData] = useState<Chapter | null>(null);
    const [summary, setSummary] = useState<string>("");

    useEffect(() => {
        // Busca o capítulo
        fetch("/api/chapter")
            .then((res) => res.json())
            .then((data) => {
                setChapterData(data);

                // Quando o capítulo carregar, pede o resumo
                fetch("/api/summary", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        book: data.book,
                        chapter: data.chapter,
                        verses: data.verses,
                    }),
                })
                    .then((res) => res.json())
                    .then((resumoData: SummaryResponse) => {
                        setSummary(
                            resumoData.summary || "Resumo não disponível"
                        );
                    })
                    .catch(console.error);
            })
            .catch(console.error);
    }, []);

    if (!chapterData)
        return (
            <div className="text-container">
                <p>Loading chapter...</p>
            </div>
        );

    return (
        <div className="text-container">
            <h2>
                {chapterData.book} {chapterData.chapter}
            </h2>
            <ul>
                {chapterData.verses.map((verse, index) => (
                    <li key={index}>{verse}</li>
                ))}
            </ul>
            <div className="image"></div>
            {/* Mostra o resumo se disponível */}
            {summary && (
                <>
                    <h2>Resumo</h2>
                    <p>{summary}</p>
                </>
            )}
        </div>
    );
}
