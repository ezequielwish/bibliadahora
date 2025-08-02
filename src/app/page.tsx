import { sortearCapitulo } from "@/lib/biblia";

export default async function Home() {
  const { livro, capitulo, versiculos } = await sortearCapitulo();

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold">{livro} {capitulo}</h1>
      <div className="mt-4 space-y-2">
        {versiculos?.map((verso, i) => (
          <p key={i}>
            <strong>{i + 1}</strong> {verso}
          </p>
        ))}
      </div>
    </main>
  );
}
