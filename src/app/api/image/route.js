export async function POST(req) {
  try {
    const { book, chapter, keywords } = await req.json(); // keywords vindas do resumo

    if (!process.env.PEXELS_API_KEY) {
      throw new Error("A variável PEXELS_API_KEY não está configurada");
    }

    // Monta a query combinando livro, capítulo e keywords
    const query = `${book} capítulo ${chapter} ${keywords?.join(" ") || ""}`;

    // Busca até 5 imagens relacionadas
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5`,
      {
        headers: {
          Authorization: process.env.PEXELS_API_KEY
        }
      }
    );

    const data = await response.json();

    if (!response.ok || !data.photos?.length) {
      throw new Error("Nenhuma imagem encontrada para a busca");
    }

    // Escolhe aleatoriamente uma das imagens retornadas
    const randomIndex = Math.floor(Math.random() * data.photos.length);
    const imageUrl = data.photos[randomIndex].src.large;

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
