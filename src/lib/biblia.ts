import fs from "fs";
import path from "path";
import crypto from "crypto";

type Livro = {
  abbrev: string;
  name: string;
  chapters: string[][];
};

function getHoraAtualComoSeed(): number {
  const now = new Date();
  return Math.floor(now.getTime() / (1000 * 60 * 60)); // uma seed por hora
}

// function getHoraAtualComoSeed(): number {
//   // ⚠️ Substituir pela hora simulada
//   const horaFalsa = new Date("2025-08-02T12:00:00"); // Altere esse horário para testar diferentes saídas
//   return Math.floor(horaFalsa.getTime() / (1000 * 60 * 60));
// }

export async function sortearCapitulo() {
  const filePath = path.join(process.cwd(), "public", "data", "nvi.json");

  let fileContent = fs.readFileSync(filePath, "utf8");
  if (fileContent.charCodeAt(0) === 0xfeff) {
    fileContent = fileContent.slice(1);
  }

  const livros: Livro[] = JSON.parse(fileContent);

  const seed = getHoraAtualComoSeed();
  const hash = crypto.createHash("sha256").update(String(seed)).digest("hex");
  const seedInt = parseInt(hash.substring(0, 8), 16);

  const livroIndex = seedInt % livros.length;
  const livro = livros[livroIndex];

  const capituloIndex = seedInt % livro.chapters.length;
  const versiculos = livro.chapters[capituloIndex];

  return {
    livro: livro.name,
    capitulo: capituloIndex + 1,
    versiculos,
  };
}