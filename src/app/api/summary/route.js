export async function POST(req) {
  try {
    const { book, chapter, verses } = await req.json();

    // Formata o texto a ser resumido
    const textToSummarize = `${book} ${chapter}: ${verses.join(" ")}`;
    // Chamada para a API do Hugging Face
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_API_KEY}`, // chave da Hugging Face
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: textToSummarize }),
      }
    );

    if (!response.ok) {
      throw new Error(`Erro na API do Hugging Face: ${response.status}`);
    }

    const data = await response.json();

    // Retorna o resumo no formato JSON
    return Response.json({
      book,
      chapter,
      summary: data[0]?.summary_text || "Resumo não disponível",
    });

  } catch (error) {
    console.error("Erro ao gerar resumo:", error);
    return Response.json({ error: "Falha ao gerar resumo" }, { status: 500 });
  }
}