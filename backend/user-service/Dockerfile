# Build context: repo root (.)
# Run `pnpm install` inside backend/user-service/ before the first Docker build
# to generate pnpm-lock.yaml, then commit it.

# ─── Stage 1: Dependencies ────────────────────────────────────────────────────
FROM node:20-alpine AS dependencies
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
COPY backend/user-service/package.json ./
COPY backend/user-service/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ─── Stage 2: Builder ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
COPY backend/user-service/package.json ./
COPY backend/user-service/tsconfig.json ./
COPY --from=dependencies /app/node_modules ./node_modules
COPY backend/user-service/src ./src
RUN pnpm build

# ─── Stage 3: Runner ──────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=dependencies /app/node_modules ./node_modules
EXPOSE 4002
CMD ["node", "dist/main"]
