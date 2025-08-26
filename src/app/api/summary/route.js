import { GoogleGenAI } from "@google/genai";

const MAX_CHARS_PER_CHUNK = 2000;
const MIN_WORDS = 50;
const MAX_WORDS = 100;

// Cache em memória do servidor
let summaryCache = {};

// Função para dividir texto em chunks
function chunkText(text, maxChars) {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    chunks.push(text.substring(start, start + maxChars));
    start += maxChars;
  }
  return chunks;
}

export async function POST(req) {
  try {
    const { book, chapter, verses } = await req.json();
    const chapterId = `${book}_${chapter}`;

    // Retorna do cache se já existe
    if (summaryCache[chapterId]) {
      return new Response(JSON.stringify({
        book,
        chapter,
        summary: summaryCache[chapterId],
        chapterId
      }), { status: 200 });
    }

    const fullText = `${book} ${chapter}: ${verses.join(' ')}`;
    const chunks = chunkText(fullText, MAX_CHARS_PER_CHUNK);
    const client = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

    const partialSummaries = [];

    for (const chunk of chunks) {
      const prompt = `
Resuma o seguinte trecho da Bíblia em no mínimo ${MIN_WORDS} e no máximo ${MAX_WORDS} palavras.
Mantenha o contexto e seja conciso e claro.
Não adicione títulos ou comentários.

Texto: ${chunk}
`;
      const response = await client.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [prompt],
      });
      partialSummaries.push(response?.text?.trim() || "");
    }

    let finalSummary = partialSummaries.join(' ');

    // Se houver múltiplos chunks, gera resumo final coerente
    if (partialSummaries.length > 1) {
      const finalPrompt = `
Com base nos seguintes resumos parciais, gere um resumo final conciso e coerente
em no mínimo ${MIN_WORDS} e no máximo ${MAX_WORDS} palavras.
Mantenha o contexto da história e seja conciso. Não adicione títulos ou comentários.

${finalSummary}
`;
      const finalResponse = await client.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [finalPrompt],
      });
      finalSummary = finalResponse?.text?.trim() || finalSummary;
    }

    // Salva no cache do servidor
    summaryCache[chapterId] = finalSummary;

    return new Response(JSON.stringify({
      book,
      chapter,
      summary: finalSummary,
      chapterId
    }), { status: 200 });

  } catch (error) {
    console.error("Erro ao gerar resumo:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
