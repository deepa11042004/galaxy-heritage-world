# Galaxy Heritage World - Coolify Deployment Guide

## Architecture Overview
Galaxy Heritage World is structured as a high-performance modular monolith with separately deployable containers:
- **Frontend (`@ghw/web`)**: Next.js 15 App Router on Node.js 20, served via standalone production server on port 3000.
- **Backend (`@ghw/api`)**: Express.js REST API with Prisma ORM, JWT authentication, and Swagger OpenAPI docs on port 4000.
- **Database (`mysql`)**: MySQL 8.0 on port 3306 with persistent volume `mysql_data`.
- **Cache & Jobs (`redis`)**: Redis 7 on port 6379 with persistent volume `redis_data`.

---

## 1. Deploying via Coolify (Docker Compose Method)

### Step 1: Add New Resource in Coolify
1. In your Coolify dashboard, create a new Project and select **Docker Compose**.
2. Select your Git repository: `https://github.com/<your-org>/galaxy-heritage-world`.
3. Branch: `main`.

### Step 2: Configure Environment Variables
Set the following environment variables in Coolify's environment manager:

```env
# Application Environments
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# MySQL Database
DB_NAME=galaxy_heritage_world
DB_USER=ghw_user
DB_PASSWORD=<secure-database-password>
DB_ROOT_PASSWORD=<secure-root-password>
DATABASE_URL=mysql://ghw_user:<secure-database-password>@mysql:3306/galaxy_heritage_world

# Security & Sessions
JWT_ACCESS_SECRET=<generate-64-char-random-string>
JWT_REFRESH_SECRET=<generate-64-char-random-string>
COOKIE_SECRET=<generate-32-char-random-string>

# Networking & URLs
CORS_ORIGIN=https://galaxyheritageworld.com
NEXT_PUBLIC_API_URL=https://galaxyheritageworld.com/api/v1
API_PORT=4000
PORT=3000

# Transactional Email (SMTP)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=<your-sendgrid-api-key>
SMTP_FROM_EMAIL=info@galaxyheritageworld.com
SALES_NOTIFICATION_EMAIL=info@galaxyheritageworld.com
```

### Step 3: Database Migration & Seeding on Deploy
In Coolify's Post-Deployment command or terminal on first launch:
```bash
docker exec -it ghw-api npx prisma db push
docker exec -it ghw-api npm run db:seed
```

---

## 2. Domain & Reverse Proxy Routing

In Coolify, configure your domains:
- **Web Frontend**: `https://galaxyheritageworld.com` -> routed to `web` container port `3000`.
- **API Backend**: `https://api.galaxyheritageworld.com` or path routing `/api/v1` -> routed to `api` container port `4000`.
- Automated SSL/TLS certificates will be provisioned by Coolify / Traefik / Caddy.

---

## 3. Health Check Endpoints
- API Health Check: `https://galaxyheritageworld.com/api/v1/health`
- Swagger UI Documentation: `https://galaxyheritageworld.com/api/v1/docs`
- Web Health Check: `https://galaxyheritageworld.com/`
