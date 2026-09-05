import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // O deploy na Fly roda o servidor Node dentro de um contêiner: o standalone
  // empacota só o que o `next start` precisa, e a imagem cai de ~400MB de
  // node_modules para dezenas. A Vercel ignora este campo.
  output: 'standalone',

  async redirects() {
    return [{ source: '/', destination: '/pt', permanent: false }]
  },
  images: {
    // AVIF primeiro: as capturas de 3200×2000 são o conteúdo mais pesado do
    // site, e a diferença aparece na primeira faixa.
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
