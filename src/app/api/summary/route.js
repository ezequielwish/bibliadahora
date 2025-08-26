import { GoogleGenAI } from "@google/genai";

const MAX_CHARS_PER_CHUNK = 2000; // Ajustável
const MIN_WORDS = 50;
const MAX_WORDS = 100;

// Cache em memória
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
    const key = `${book}_${chapter}`;

    // Retorna imediatamente se já existe no cache em memória
    if (summaryCache[key]) {
      return new Response(JSON.stringify({ book, chapter, summary: summaryCache[key] }), { status: 200 });
    }

    const fullText = `${book} ${chapter}: ${verses.join(' ')}`;
    const chunks = chunkText(fullText, MAX_CHARS_PER_CHUNK);
    const client = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

    const partialSummaries = [];
    for (const chunk of chunks) {
      const chunkPrompt = `
Resuma o seguinte trecho da Bíblia em no mínimo ${MIN_WORDS} e no máximo ${MAX_WORDS} palavras.
Mantenha o contexto e seja conciso e claro.
Não adicione títulos ou comentários.

Texto: ${chunk}
`;
      const response = await client.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [chunkPrompt],
      });
      partialSummaries.push(response?.text?.trim() || "");
    }

    let finalSummaryText = partialSummaries.join(' ');

    if (partialSummaries.length > 1) {
      const finalSummaryPrompt = `
Com base nos seguintes resumos parciais, gere um resumo final conciso e coerente
em no mínimo ${MIN_WORDS} e no máximo ${MAX_WORDS} palavras.
Mantenha o contexto da história e seja conciso. Não adicione títulos ou comentários.

${finalSummaryText}
`;
      const finalResponse = await client.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [finalSummaryPrompt],
      });
      finalSummaryText = finalResponse?.text?.trim() || finalSummaryText;
    }

    // Salva no cache em memória
    summaryCache[key] = finalSummaryText;

    return new Response(JSON.stringify({ book, chapter, summary: finalSummaryText }), { status: 200 });

  } catch (error) {
    console.error("Erro ao gerar resumo:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
