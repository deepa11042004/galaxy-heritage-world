import { config } from '../config/env.js';
import { logger } from '../config/logger.js';

/**
 * Tell the Next.js site to drop its cached public content so published edits appear immediately.
 * Best-effort: failures are logged and never block the admin action (pages still refresh within 60s).
 */
export function notifyFrontend(): void {
  const { url, secret } = config.revalidate;
  if (!url || !secret) return;
  fetch(url, { method: 'POST', headers: { 'x-revalidate-secret': secret } }).catch((err) =>
    logger.warn({ err: String(err) }, 'Frontend revalidation request failed')
  );
}
