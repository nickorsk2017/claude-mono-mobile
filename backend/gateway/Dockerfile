# Build context: repo root (.)
# Run `pnpm install` inside backend/gateway/ before the first Docker build
# to generate pnpm-lock.yaml, then commit it.

# ─── Stage 1: Dependencies ────────────────────────────────────────────────────
FROM node:20-alpine AS dependencies
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
COPY backend/gateway/package.json ./
COPY backend/gateway/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ─── Stage 2: Builder ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
COPY backend/gateway/package.json ./
COPY backend/gateway/tsconfig.json ./
COPY --from=dependencies /app/node_modules ./node_modules
COPY backend/gateway/src ./src
RUN pnpm build

# ─── Stage 3: Runner ──────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=dependencies /app/node_modules ./node_modules
EXPOSE 4000
CMD ["node", "dist/main"]
