# ==============================================================================
# GALAXY HERITAGE WORLD - NEXT.JS WEB DOCKERFILE
# ==============================================================================
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# --- Dependencies stage ---
FROM base AS deps
COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY apps/web/package*.json ./apps/web/
RUN npm ci

# --- Build stage ---
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY packages/shared ./packages/shared
COPY apps/web ./apps/web
COPY public ./public
COPY package*.json ./

# Build shared package
RUN npm --workspace=packages/shared run build

# Build Next.js
WORKDIR /app/apps/web
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# --- Runner stage ---
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

WORKDIR /app

COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

WORKDIR /app/apps/web
CMD ["npx", "next", "start", "-p", "3000", "-H", "0.0.0.0"]
