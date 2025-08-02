import crypto from "crypto";
import nvi from "@/../public/data/nvi.json";

function getHoraAtualComoSeed() {
  const now = new Date();
  return Math.floor(now.getTime() / (1000 * 60 * 60));
}

export async function GET() {
  const livros = nvi;

  const seed = getHoraAtualComoSeed();
  const hash = crypto.createHash("sha256").update(String(seed)).digest("hex");
  const seedInt = parseInt(hash.substring(0, 8), 16);

  const livro = livros[seedInt % livros.length];
  const capituloIndex = seedInt % livro.chapters.length;
  const versiculos = livro.chapters[capituloIndex];

  return Response.json({
    livro: livro.name,
    capitulo: capituloIndex + 1,
    versiculos,
  });
}
