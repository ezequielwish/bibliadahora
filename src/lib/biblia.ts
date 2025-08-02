import fs from "fs";
import path from "path";

export async function sortearCapitulo() {
  const filePath = path.join(process.cwd(), "public", "data", "nvi.json");

  let fileContent = fs.readFileSync(filePath, "utf8");

  // 🔧 Remove BOM (Byte Order Mark) se houver
  if (fileContent.charCodeAt(0) === 0xFEFF) {
    fileContent = fileContent.slice(1);
  }

  const livros = JSON.parse(fileContent) as {
    abbrev: string;
    name: string;
    chapters: string[][];
  }[];

  const livroIndex = Math.floor(Math.random() * livros.length);
  const livro = livros[livroIndex];

  const capituloIndex = Math.floor(Math.random() * livro.chapters.length);
  const versiculos = livro.chapters[capituloIndex];

  return {
    livro: livro.name,
    capitulo: capituloIndex + 1,
    versiculos,
  };
}
