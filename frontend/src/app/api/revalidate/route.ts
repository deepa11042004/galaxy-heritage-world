import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';

/**
 * Called by the API after an admin publishes, edits or deletes content, so public pages refresh
 * immediately instead of waiting for the 60s cache window. Requires the shared REVALIDATE_SECRET.
 */
export async function POST(req: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET;
  const given = req.headers.get('x-revalidate-secret') ?? '';
  const ok =
    !!expected &&
    given.length === expected.length &&
    timingSafeEqual(Buffer.from(given), Buffer.from(expected));
  if (!ok) return NextResponse.json({ success: false }, { status: 401 });

  revalidateTag('content');
  return NextResponse.json({ success: true });
}
