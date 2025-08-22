"use client";
import { useEffect, useState } from "react";
import Summary from "./components/summaryContainer.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";

// Tipo para os dados do capítulo
type Chapter = {
    book: string;
    chapter: number;
    verses: string[];
};

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [chapterData, setChapterData] = useState<Chapter | null>(null);

    useEffect(() => {

        // Inicia o estado de loading
        setLoading(true);

        // Busca o capítulo
        fetch("/api/chapter")
            .then((res) => res.json())
            .then((data) => {
                setChapterData(data);
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    if (!chapterData || loading)
        return <LoadingSpinner text="Carregando Capítulo..." />;

    return (
        <>
            <div className="text-container">
                <h2>
                    {chapterData.book} {chapterData.chapter}
                </h2>
                <ul>
                    {chapterData.verses.map((verse, index) => (
                        <li key={index}>{verse}</li>
                    ))}
                </ul>
            </div>
            <div className="text-container">
                {chapterData && (
                    <Summary
                        book={chapterData.book}
                        chapter={chapterData.chapter}
                        verses={chapterData.verses}
                    />
                )}
            </div>
        </>
    );
}
