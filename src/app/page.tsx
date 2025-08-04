"use client";
import { useEffect, useState } from "react";

type Capitulo = {
  livro: string;
  capitulo: number;
  versiculos: string[];
};

export default function Home() {
  const [capitulo, setCapitulo] = useState<Capitulo | null>(null);

  useEffect(() => {
    fetch("/api/capitulo")
      .then((res) => res.json())
      .then(setCapitulo)
      .catch(console.error);
  }, []);

  if (!capitulo) return <p>Carregando capítulo...</p>;

  return (
    <div className="text-container">
      <h1>{capitulo.livro} {capitulo.capitulo}</h1>
      <ul>
        {capitulo.versiculos.map((v, i) => (
          <li key={i}>{v}</li>
        ))}
      </ul>
    </div>
  );
}
