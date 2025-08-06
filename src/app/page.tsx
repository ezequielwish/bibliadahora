"use client";
import { useEffect, useState } from "react";

// Tipo que representa a estrutura dos dados retornados pela API
type Chapter = {
  book: string;
  chapter: number;
  verses: string[];
};

export default function Home() {
  // Armazena o capítulo retornado pela API
  const [chapterData, setChapterData] = useState<Chapter | null>(null);

  useEffect(() => {
    // Requisição para buscar o capítulo sorteado do backend
    fetch("/api/capitulo")
      .then((res) => res.json())
      .then(setChapterData)
      .catch(console.error); // Mostra erros no console, se houver
  }, []);

  // Exibe mensagem enquanto os dados estão sendo carregados
  if (!chapterData) return <p>Loading chapter...</p>;

  // Exibe o capítulo sorteado com seus versículos
  return (
    <div className="text-container">
      <h1>
        {chapterData.book} {chapterData.chapter}
      </h1>
      <ul>
        {chapterData.verses.map((verse, index) => (
          <li key={index}>{verse}</li>
        ))}
      </ul>
    </div>
  );
}
