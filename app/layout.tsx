import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: '--font-montserrat'
});

// Nota: A fonte Sailors precisará ser importada como fonte local
// assumindo que estará na pasta public/fonts

export const metadata: Metadata = {
  title: "Sistema de Inscrições",
  description: "Sistema de inscrições para eventos com pagamento via PIX",
};

// Configuração para ajudar nas páginas dinâmicas
export const dynamic = 'auto';
export const dynamicParams = true;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Adicionar fonte Sailors como fonte local */}
        <link rel="stylesheet" href="/fonts/sailors/stylesheet.css" />
      </head>
      <body className={`${montserrat.variable} font-sans`}>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
