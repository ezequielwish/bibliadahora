import "./summaryContainer.css";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner.jsx";

export default function Summary({ book, chapter, verses, chapterId }) {
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState("");
    const [imageUrl, setImageUrl] = useState("/assets/image.png");

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
                setImageUrl(parsed.imageUrl || "/assets/image.png");
                setLoading(false);
                return;
            }
        }

        let fetchedSummary = "";
        let fetchedImageUrl = "/assets/image.png";

        // Faz a requisição para obter o resumo do capítulo
        fetch("/api/summary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ book, chapter, verses }),
        })
            .then((res) => res.json())
            .then((resumoData) => {
                fetchedSummary = resumoData.summary || "Resumo não disponível";
                setSummary(fetchedSummary);

                // Depois de pegar o resumo, busca a imagem
                return fetch("/api/image", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        prompt: `${book} capítulo ${chapter}`,
                    }),
                });
            })
            .then((res) => res.json())
            .then((imageData) => {
                if (imageData.imageUrl) {
                    fetchedImageUrl = imageData.imageUrl;
                    setImageUrl(fetchedImageUrl);
                }

                // Salva resumo e imagem no localStorage
                localStorage.setItem(
                    LOCAL_STORAGE_KEY,
                    JSON.stringify({
                        chapterId,
                        summary: fetchedSummary,
                        imageUrl: fetchedImageUrl,
                    })
                );

                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [book, chapter, verses, chapterId]);

    if (loading) {
        return <LoadingSpinner text="Gerando resumo..." />;
    }

    return (
        <>
            <figure>
                <img
                    className="image"
                    src={imageUrl}
                    alt={`${book} capítulo ${chapter}`}
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
