import "./summaryContainer.css";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner.jsx";

export default function Summary({ book, chapter, verses }) {
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState("");

    // Quando o capítulo carregar, pede o resumo
    useEffect(() => {
        if (!book || !chapter || !verses) return;
        if (!Array.isArray(verses)) return;

        // Inicia o estado de loading
        setLoading(true);

        // Faz a requisição para obter o resumo do capítulo
        fetch("/api/summary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ book, chapter, verses }),
        })
            .then((res) => res.json())
            .then((resumoData) => {
                setSummary(resumoData.summary || "Resumo não disponível");
                setLoading(false);
            })
            .catch(console.error);
    }, [book, chapter, verses]);

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
                // Mostra o resumo do capítulo
                <>
                    <h2>Resumo</h2>
                    <p>{summary}</p>
                </>
            )}
        </>
    );
}
