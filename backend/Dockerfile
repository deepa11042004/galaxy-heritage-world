FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

ENV NODE_ENV=production
ENV API_PORT=4000
EXPOSE 4000

CMD ["node", "dist/server.js"]
