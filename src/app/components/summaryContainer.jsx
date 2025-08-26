import "./summaryContainer.css";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner.jsx";

export default function Summary({ book, chapter, verses, chapterId }) {
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState("");

    const LOCAL_STORAGE_KEY = "currentChapterSummary";

    useEffect(() => {
        if (!book || !chapter || !verses || !chapterId) return;
        if (!Array.isArray(verses)) return;

        setLoading(true);

        // Tenta usar o cache local
        const cachedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cachedData) {
            const parsed = JSON.parse(cachedData);
            if (parsed.chapterId === chapterId) {
                setSummary(parsed.summary);
                setLoading(false);
                return;
            }
        }

        // Faz a requisição para obter o resumo do capítulo
        fetch("/api/summary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ book, chapter, verses }),
        })
            .then((res) => res.json())
            .then((resumoData) => {
                const resumo = resumoData.summary || "Resumo não disponível";
                setSummary(resumo);
                setLoading(false);

                // Salva no localStorage com o chapterId
                localStorage.setItem(
                    LOCAL_STORAGE_KEY,
                    JSON.stringify({ chapterId, summary: resumo })
                );
            })
            .catch(console.error);
    }, [book, chapter, verses, chapterId]);

    if (loading) {
        return <LoadingSpinner text="Gerando resumo..." />;
    }

    return (
        <>
            <figure>
                <img
                    className="image"
                    src="/assets/image.png"
                    alt="Imagem ilustrativa"
                />
                <figcaption className="image-description">
                    Imagem representativa do capítulo
                </figcaption>
            </figure>
            {summary && (
                <>
                    <h2>Resumo</h2>
                    <p className="summary">{summary}</p>
                </>
            )}
        </>
    );
}
