import fs from "fs";
import path from "path";
import crypto from "crypto";

// Tipo que representa a estrutura de um livro da Bíblia no JSON
type Livro = {
  abbrev: string;       // Abreviação do nome do livro
  name: string;         // Nome completo do livro
  chapters: string[][]; // Matriz de capítulos, onde cada capítulo é um array de versículos
};

/**
 * Gera uma "seed" numérica baseada na hora atual, que muda a cada hora.
 * Isso garante que o capítulo sorteado mude a cada nova hora do dia.
 */
function getHoraAtualComoSeed(): number {
  const now = new Date();
  return Math.floor(now.getTime() / (1000 * 60 * 60)); // 1 hora em milissegundos
}

// Função alternativa para testes com hora fixa
// function getHoraAtualComoSeed(): number {
//   const horaFalsa = new Date("2025-08-02T15:00:00"); // Altere esse horário para testar diferentes saídas
//   return Math.floor(horaFalsa.getTime() / (1000 * 60 * 60));
// }

/**
 * Sorteia um capítulo da Bíblia com base na hora atual.
 * Utiliza um arquivo JSON com os livros e capítulos, e uma seed gerada pela hora.
 */
export async function sortearCapitulo() {
  // Caminho para o arquivo JSON com a estrutura da Bíblia (NVI)
  const filePath = path.join(process.cwd(), "public", "data", "nvi.json");

  // Lê o conteúdo do arquivo
  let fileContent = fs.readFileSync(filePath, "utf8");

  // Remove BOM (Byte Order Mark) caso exista — evita erro no JSON.parse
  if (fileContent.charCodeAt(0) === 0xfeff) {
    fileContent = fileContent.slice(1);
  }

  // Converte o conteúdo JSON para um array de livros
  const livros: Livro[] = JSON.parse(fileContent);

  // Gera uma seed determinística com base na hora
  const seed = getHoraAtualComoSeed();

  // Cria um hash SHA-256 da seed para obter mais entropia
  const hash = crypto.createHash("sha256").update(String(seed)).digest("hex");

  // Converte parte do hash para inteiro
  const seedInt = parseInt(hash.substring(0, 8), 16);

  // Seleciona um livro com base na seed
  const livroIndex = seedInt % livros.length;
  const livro = livros[livroIndex];

  // Seleciona um capítulo do livro com base na mesma seed
  const capituloIndex = seedInt % livro.chapters.length;
  const versiculos = livro.chapters[capituloIndex];

  // Retorna os dados do capítulo sorteado
  return {
    livro: livro.name,
    capitulo: capituloIndex + 1, // +1 para ajustar o índice (cap. 0 => cap. 1)
    versiculos,
  };
}
