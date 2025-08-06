import type { Metadata } from "next";
import "./globals.css";
import Header from './components/header'


export const metadata: Metadata = {
  title: "Bíblia da hora",
  description: "A cada hora, um capítulo da bíblia cristã para você refletir!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body>
        <Header/>
        {children}
        <footer></footer>
      </body>
    </html>
  );
}
