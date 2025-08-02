/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite requisições para domínios externos
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
  
  // Configurações adicionais se necessário
  experimental: {
    // Permite usar fetch no servidor
    serverComponentsExternalPackages: [],
  },
  
  // Para evitar problemas de CORS durante desenvolvimento
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;