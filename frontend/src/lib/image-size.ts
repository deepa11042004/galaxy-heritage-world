import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const cache = new Map<string, { width: number; height: number } | null>();

/**
 * Pixel size of an image served from this site's /public folder (server-side only).
 * Returns null for remote URLs or images that are not in /public (e.g. admin uploads, which the API stores and
 * resizes to at most 2000px).
 */
export async function getPublicImageSize(src: string): Promise<{ width: number; height: number } | null> {
  if (!src || !src.startsWith('/') || src.startsWith('//') || src.includes('..')) return null;
  if (cache.has(src)) return cache.get(src)!;

  let result: { width: number; height: number } | null = null;
  try {
    const file = path.join(process.cwd(), 'public', src.split('?')[0]);
    const meta = await sharp(file).metadata();
    if (meta.width && meta.height) result = { width: meta.width, height: meta.height };
  } catch {
    result = null;
  }
  cache.set(src, result);
  return result;
}
