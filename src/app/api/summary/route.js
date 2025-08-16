export async function POST(req) {
  try {
    const { book, chapter, verses } = await req.json();

    if (!process.env.HF_API_KEY) {
      throw new Error("Variável HF_API_KEY não configurada na Vercel");
    }

    const textToSummarize = `${book} ${chapter}: ${verses.join(" ")}`;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: textToSummarize }),
      }
    );

    if (!response.ok) {
      throw new Error(`Erro na API do Hugging Face: ${response.status}`);
    }

    const data = await response.json();

    return Response.json({
      book,
      chapter,
      summary: data[0]?.summary_text || "Resumo não disponível",
    });

  } catch (error) {
    console.error("Erro ao gerar resumo:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}