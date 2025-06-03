import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
