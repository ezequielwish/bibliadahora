export async function POST(req) {
  try {
    const { query } = await req.json(); // recebe o termo de busca

    if (!process.env.PEXELS_API_KEY) {
      throw new Error("A variável PEXELS_API_KEY não está configurada");
    }

    // Faz a requisição à API do Pexels
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query || "Bíblia")}&per_page=1`, {
      headers: {
        Authorization: process.env.PEXELS_API_KEY
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || "Erro ao buscar imagem");
    }

    // Pega a primeira imagem retornada
    const imageUrl = data.photos?.[0]?.src?.large || null;

    if (!imageUrl) {
      throw new Error("Nenhuma imagem encontrada para a busca");
    }

    return new Response(
      JSON.stringify({ imageUrl }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Erro ao buscar imagem:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
