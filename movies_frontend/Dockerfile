FROM node:26-alpine AS base
RUN npm install -g pnpm@11.12.0

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
# aprova os build scripts (sharp etc.) e não falha se algum for ignorado
RUN pnpm install --no-frozen-lockfile --config.confirmModulesPurge=false \
 && pnpm rebuild sharp || true

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

FROM base AS run
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# o standalone serve estáticos e public a partir daqui:
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]