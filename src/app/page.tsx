"use client";
import { useEffect, useState } from "react";
import Summary from "./components/summaryContainer.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";

type Chapter = {
    seed: string;
    book: string;
    chapter: number;
    verses: string[];
    chapterId: string;
};

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [chapterData, setChapterData] = useState<Chapter | null>(null);

    useEffect(() => {
        // 1. Tenta pegar do localStorage primeiro
        const cached = localStorage.getItem("chapterData");
        if (cached) {
            try {
                const parsed: Chapter = JSON.parse(cached);
                setChapterData(parsed);
                setLoading(false); // já mostra capítulo
            } catch (e) {
                console.error("Erro ao parsear cache:", e);
            }
        }

        // 2. Busca da API em paralelo
        fetch("/api/chapter")
            .then((res) => res.json())
            .then((data: Chapter) => {
                // só atualiza se não existir cache ou se for diferente
                if (!cached || JSON.stringify(data) !== cached) {
                    localStorage.setItem("chapterData", JSON.stringify(data));
                    setChapterData(data);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erro na API:", err);
                setLoading(false);
            });
    }, []);

    if (!chapterData || (loading && !localStorage.getItem("chapterData"))) {
        return <LoadingSpinner text="Carregando Capítulo..." />;
    }

    return (
        <>
            <section className="text-container fade-in">
                <div>
                    <h2>
                        {chapterData.book}
                        <span className="chapter">
                            {" "}
                            | capítulo: {chapterData.chapter}
                        </span>
                    </h2>
                </div>
                <ul>
                    {chapterData.verses.map((verse, index) => (
                        <li key={index}>
                            <span className="verse-number">{index + 1}</span>
                            <span className="verse">{verse}</span>
                        </li>
                    ))}
                </ul>
                <p className="seed">ID: {chapterData.seed}</p>
            </section>

            <section className="text-container fade-in">
                <Summary
                    book={chapterData.book}
                    chapter={chapterData.chapter}
                    verses={chapterData.verses}
                    chapterId={chapterData.chapterId}
                />
            </section>
        </>
    );
}
