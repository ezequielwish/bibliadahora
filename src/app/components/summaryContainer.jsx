import "./summaryContainer.css";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner.jsx";

export default function Summary({ book, chapter, verses, chapterId }) {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const [imageUrl, setImageUrl] = useState("/assets/image.png");

  const LOCAL_STORAGE_KEY = `chapter_${chapterId}`;

  useEffect(() => {
    if (!book || !chapter || !verses || !chapterId) return;
    if (!Array.isArray(verses)) return;

    setLoading(true);

    // Tenta usar cache local
    const cachedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      setSummary(parsed.summary);
      setImageUrl(parsed.imageUrl || "/assets/image.png");
      setLoading(false);
      return;
    }

    let fetchedSummary = "";
    let fetchedImageUrl = "/assets/image.png";

    // 1️⃣ Busca resumo + keywords
    fetch("/api/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ book, chapter, verses }),
    })
      .then((res) => res.json())
      .then(async (resumoData) => {
        fetchedSummary = resumoData.summary || "Resumo não disponível";
        const keywords = resumoData.keywords || [];

        setSummary(fetchedSummary);

        // 2️⃣ Busca imagem usando keywords
        const imageRes = await fetch("/api/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ book, chapter, keywords }),
        });
        const imageData = await imageRes.json();
        if (imageData.imageUrl) {
          fetchedImageUrl = imageData.imageUrl;
          setImageUrl(fetchedImageUrl);
        }

        // 3️⃣ Salva resumo + imagem no cache local
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({
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
          width={700}
          height={700}
          style={{ objectFit: "cover" }}
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
