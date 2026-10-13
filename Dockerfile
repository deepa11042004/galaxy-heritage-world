# ==============================================================================
# GALAXY HERITAGE WORLD - PRODUCTION DOCKERFILE
# ==============================================================================
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl

# --- Dependencies stage ---
FROM base AS deps
COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY apps/api/package*.json ./apps/api/
COPY apps/web/package*.json ./apps/web/
# Install dependencies with memory limit flag
ENV NODE_OPTIONS="--max-old-space-size=1536"
RUN npm ci --prefer-offline --no-audit

# --- Builder stage ---
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api
COPY apps/web ./apps/web
COPY public ./public

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=1536"

# Build shared library
RUN npm --workspace=packages/shared run build

# Generate Prisma client and build web
WORKDIR /app/apps/api
RUN npx prisma generate

WORKDIR /app
RUN npm --workspace=apps/web run build

# --- Runner stage ---
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

WORKDIR /app

# Copy built artifacts
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

WORKDIR /app/apps/web
CMD ["npx", "next", "start", "-p", "3000", "-H", "0.0.0.0"]
