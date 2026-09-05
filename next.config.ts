import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
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
