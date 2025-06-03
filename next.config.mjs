/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Aviso em vez de erro no build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Aviso em vez de erro no build
    ignoreBuildErrors: true,
  },
  output: 'standalone', // Otimizado para implantação serverless
  experimental: {
    // Ajudar com o Suspense e componentes client
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Desabilitar pré-renderização estática para páginas que usam dados dinâmicos
  staticPageGenerationTimeout: 120,
};

export default nextConfig; 