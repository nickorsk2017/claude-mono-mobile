# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# ─── Dependencies ────────────────────────────────────────────────────────────
FROM base AS dependencies
COPY backend/package.json backend/pnpm-lock.yaml ./backend/
RUN cd backend && pnpm install --frozen-lockfile

# ─── Builder ─────────────────────────────────────────────────────────────────
FROM dependencies AS builder
COPY backend/ ./backend/
RUN cd backend && pnpm build

# ─── Runner ──────────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY --from=builder /app/backend/package.json ./backend/package.json

USER nestjs
EXPOSE 4000

CMD ["node", "backend/dist/main.js"]
