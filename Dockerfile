#syntax=docker/dockerfile:1.4
FROM node:18-alpine AS base

# deps
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY --link package.json package-lock.json ./
RUN npm ci

# builder
FROM base AS builder
WORKDIR /app
COPY --from=deps --link /app/node_modules ./node_modules
COPY --link  . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN \
  addgroup --system --gid 1001 nodejs; \
  adduser --system --uid 1001 nextjs

COPY --from=builder --link /app/public ./public

COPY --from=builder --link --chown=1001:1001 /app/.next/standalone ./
COPY --from=builder --link --chown=1001:1001 /app/.next/static ./.next/static

RUN mkdir -m 777 uploads

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME localhost

CMD ["node", "server.js"]