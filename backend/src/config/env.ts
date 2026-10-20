import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

const isProd = process.env.NODE_ENV === 'production';

function secret(name: string, fallback: string): string {
  const value = process.env[name];
  if (value && value.length >= 32) return value;
  if (isProd) throw new Error(`${name} must be set to a random string of at least 32 characters in production`);
  return value || fallback;
}

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.API_PORT || '4000', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  jwt: {
    accessSecret: secret('JWT_ACCESS_SECRET', 'fallback-access-secret-change-in-prod'),
    refreshSecret: secret('JWT_REFRESH_SECRET', 'fallback-refresh-secret-change-in-prod'),
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '1h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  cookie: {
    secret: secret('COOKIE_SECRET', 'fallback-cookie-secret'),
    secure: process.env.NODE_ENV === 'production',
  },
  smtp: {
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    fromEmail: process.env.SMTP_FROM_EMAIL || 'info@galaxyheritageworld.com',
    salesEmail: process.env.SALES_NOTIFICATION_EMAIL || 'info@galaxyheritageworld.com',
  },
  redis: {
    enabled: process.env.REDIS_ENABLED === 'true',
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  // Optional: lets the API tell the Next.js site to refresh cached public pages after admin edits.
  revalidate: {
    url: process.env.FRONTEND_REVALIDATE_URL || '',
    secret: process.env.REVALIDATE_SECRET || '',
  },
  media: {
    maxSizeBytes: parseInt(process.env.UPLOAD_MAX_SIZE_BYTES || '10485760', 10), // 10MB
    uploadDir: path.resolve(process.cwd(), 'uploads'),
  },
};
