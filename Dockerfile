# Imagem do portfólio para a Fly.io. Três estágios para a camada final ficar
# só com o servidor: a máquina é a menor que a Fly vende (256MB), então tudo
# que não roda em produção fica para trás.

FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Sem os testes aqui: o gate do vitest roda antes, na máquina de quem faz o
# deploy. Dentro da imagem ele só somaria minutos de build.
RUN npx next build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
# O standalone já traz o server.js e as dependências que ele usa; o static
# fica de fora do pacote e precisa ser copiado à parte.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
