# 📖 Bíblia da Hora

Um aplicativo web que exibe **um capítulo aleatório da Bíblia** que muda automaticamente **a cada hora**.  
O sorteio é feito **no lado do servidor** para que todos os usuários vejam o mesmo capítulo simultaneamente.  
Não depende de APIs externas — os dados vêm de um arquivo local JSON.

---

## 🚀 Tecnologias utilizadas

- [Next.js 14+ (App Router)](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Node.js `fs` e `path`](https://nodejs.org/api/fs.html)
- [Crypto (para geração de seed determinística)](https://nodejs.org/api/crypto.html)
- HTML + CSS

---

## 🔧 Como funciona

1. O arquivo `nvi.json` contém todos os livros, capítulos e versículos da Bíblia (NVI).
2. A rota `chapter` da API lê o arquivo e usa uma **seed baseada na hora atual**.
3. Essa seed é transformada em um número pseudoaleatório usando **SHA-256**.
4. O resultado é usado para selecionar um livro e um capítulo.
5. Como a seed é baseada na hora, todos os usuários recebem **o mesmo capítulo** por 1 hora.

---

## 🛠️ Como rodar localmente

1. **Clonar o repositório**
   ```bash
   git clone https://github.com/seu-usuario/biblia-da-hora.git
   cd biblia-da-hora
   ```

2. **Instalar as dependências**
   ```bash
   npm install
   ```

3. **Rodar em modo desenvolvimento**
   ```bash
   npm run dev
   ```

4. Abra no navegador:
   ```
   http://localhost:3000
   ```

---

## 📦 Deploy

Este projeto está hospedado na [Vercel](https://vercel.com/) e pode ser acessado através da URL: (https://bibliadahora.vercel.app/)

---

## 📜 Licença

Este projeto está sob a licença **Apache**.  
O texto bíblico da NVI foi retirado do repositório público de [thiagobodruk/biblia](https://github.com/thiagobodruk/biblia).
