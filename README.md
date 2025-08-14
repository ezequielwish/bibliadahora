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

## 📂 Estrutura do projeto

```
📦 biblia-da-hora
 ┣ 📂 app
 ┃ ┗ 📜 page.tsx          # Página principal
 ┣ 📂 lib
 ┃ ┗ 📜 biblia.ts         # Função de sorteio do capítulo
 ┣ 📂 public
 ┃ ┗ 📂 data
 ┃    ┗ 📜 nvi.json       # Texto bíblico completo (Nova Versão Internacional)
 ┣ 📜 package.json
 ┣ 📜 tsconfig.json
 ┣ 📜 README.md
```

---

## 🔧 Como funciona

1. O arquivo `nvi.json` contém todos os livros, capítulos e versículos da Bíblia (NVI).
2. A função `sortearCapitulo()` lê o arquivo e usa uma **seed baseada na hora atual**.
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

## 🔍 Testando capítulos sem esperar 1 hora

Para simular horários diferentes e testar o sorteio:

- Edite `getHoraAtualComoSeed()` no arquivo `biblia.ts` para usar uma hora fixa:
  ```ts
  const horaFalsa = new Date("2025-08-02T15:00:00");
  ```
- Ou defina uma variável de ambiente:
  ```bash
  FORCE_HOUR="2025-08-02T18:00:00" npm run dev
  ```

---

## 📦 Deploy

Este projeto foi desenvolvido para rodar facilmente na [Vercel](https://vercel.com/).  
Basta criar um novo projeto e conectar ao repositório GitHub.

---

## 📜 Licença

Este projeto está sob a licença **MIT**.  
O texto bíblico da NVI foi retirado do repositório público de [thiagobodruk/biblia](https://github.com/thiagobodruk/biblia).
