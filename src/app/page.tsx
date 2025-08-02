import { sortearCapitulo } from "@/lib/biblia";

export default async function Home() {
  const { livro, capitulo, versiculos } = await sortearCapitulo();

  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {livro} {capitulo}
      </h1>
      <div className="space-y-2">
        {versiculos.map((verso, i) => (
          <p key={i}>
            <strong>{i + 1}</strong> {verso}
          </p>
        ))}
      </div>
    </main>
  );
}
