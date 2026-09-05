import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // O deploy na Fly roda o servidor Node dentro de um contêiner: o standalone
  // empacota só o que o `next start` precisa, e a imagem cai de ~400MB de
  // node_modules para dezenas. A Vercel ignora este campo.
  output: 'standalone',

  async redirects() {
    return [{ source: '/', destination: '/pt', permanent: false }]
  },
  // Não há mais bloco `images`: nenhum componente usa `next/image`. As
  // capturas são assadas em AVIF e WebP no build por
  // `scripts/otimizar-prints.mjs`, e o `PrintFigura` serve os arquivos prontos
  // num `<picture>`. Otimizar em runtime derrubava a máquina de 256MB.
}

export default nextConfig
