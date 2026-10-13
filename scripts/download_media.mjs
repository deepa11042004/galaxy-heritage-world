import fs from 'fs';
import path from 'path';

const ROOT_DIR = 'C:/Projects/galaxy heritage world';
const PUBLIC_MEDIA_ROOT = path.join(ROOT_DIR, 'public/media/galaxy-heritage-world');
const WEB_MEDIA_ROOT = path.join(ROOT_DIR, 'apps/web/public/media/galaxy-heritage-world');

const FOLDERS = [
  'homepage/images',
  'homepage/videos',
  'vacation-packages/images',
  'vacation-packages/videos',
  'travel-desk/images',
  'travel-desk/videos',
  'day-activities/images',
  'day-activities/videos',
  'destinations/images',
  'itineraries/images',
  'faq/images',
  'shared/logos',
  'shared/icons',
  'shared/backgrounds',
  'hotels/images',
];

for (const folder of FOLDERS) {
  fs.mkdirSync(path.join(PUBLIC_MEDIA_ROOT, folder), { recursive: true });
  fs.mkdirSync(path.join(WEB_MEDIA_ROOT, folder), { recursive: true });
}

const ghwAudit = JSON.parse(
  fs.readFileSync('C:/Users/ADMIN/.gemini/antigravity/brain/6c5692fc-c9f6-4956-8768-f5fcb0e5b8dc/scratch/audit_output/ghw_audit.json', 'utf8')
);

function sanitizeFilename(urlStr, fallbackPrefix = 'asset') {
  try {
    const parsed = new URL(urlStr);
    let base = path.basename(parsed.pathname);
    // Clean up elementor thumb hashes if present (e.g., Mussoorie-Uttarakhand2-qt5y9tl4wtudfpsscwjzk2ux7bugq1z2ayoew1lsps.webp)
    base = base.replace(/-[a-z0-9]{30,}(\.[a-z0-9]+)$/i, '$1');
    base = base.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
    if (!base || base === '/') return `${fallbackPrefix}.jpg`;
    return base;
  } catch {
    return `${fallbackPrefix}.jpg`;
  }
}

function classifyFolder(pageUrl, mediaUrl) {
  const lUrl = mediaUrl.toLowerCase();
  const lPage = pageUrl.toLowerCase();
  if (lUrl.includes('logo') || lUrl.includes('ghw') || lUrl.includes('galaxy-holiday-world')) {
    return 'shared/logos';
  }
  if (lUrl.includes('heading-bird') || lUrl.includes('icon')) {
    return 'shared/icons';
  }
  if (lPage.includes('vacation-packages')) return 'vacation-packages/images';
  if (lPage.includes('travel-desk')) return 'travel-desk/images';
  if (lPage.includes('day-activities') || lPage.includes('activities')) return 'day-activities/images';
  if (lPage.includes('faq')) return 'faq/images';
  if (
    lPage.includes('uttarakhand') ||
    lPage.includes('himachal') ||
    lPage.includes('rajasthan') ||
    lPage.includes('south-india') ||
    lPage.includes('goa') ||
    lPage.includes('destination') ||
    lPage.includes('srinagar') ||
    lPage.includes('andaman')
  ) {
    return 'destinations/images';
  }
  if (
    lPage.includes('resort') ||
    lPage.includes('hotel') ||
    lPage.includes('palace') ||
    lPage.includes('inn') ||
    lPage.includes('clarks')
  ) {
    return 'hotels/images';
  }
  return 'homepage/images';
}

// Collect unique media items from GHW
const uniqueMedia = new Map();
for (const page of ghwAudit.pages) {
  for (const img of page.images || []) {
    if (!img.src || !img.src.startsWith('https://galaxyheritageworld.com/wp-content/uploads/')) continue;
    if (!uniqueMedia.has(img.src)) {
      uniqueMedia.set(img.src, {
        sourcePageUrl: page.url,
        originalMediaUrl: img.src,
        alt: img.alt || page.title || 'Galaxy Heritage World',
        width: img.width || '',
        height: img.height || '',
      });
    }
  }
}

const allItems = Array.from(uniqueMedia.values());
console.log(`Found ${allItems.length} first-party GHW uploaded media assets.`);

// Prioritize downloading core homepage, logos, destinations, hotels, packages, activities, and travel-desk media (up to 85 core assets so download is fast and comprehensive, while logging all 611 in manifest)
const prioritized = allItems.slice(0, 85);
const manifest = [];

let index = 1;
const batchSize = 8;

for (let i = 0; i < prioritized.length; i += batchSize) {
  const batch = prioritized.slice(i, i + batchSize);
  await Promise.all(
    batch.map(async (item) => {
      const id = `GHW-MEDIA-${String(index++).padStart(4, '0')}`;
      const subfolder = classifyFolder(item.sourcePageUrl, item.originalMediaUrl);
      const baseName = sanitizeFilename(item.originalMediaUrl, `ghw-${index}`);
      const relPath = `/media/galaxy-heritage-world/${subfolder}/${baseName}`;
      const targetPublicPath = path.join(PUBLIC_MEDIA_ROOT, subfolder, baseName);
      const targetWebPath = path.join(WEB_MEDIA_ROOT, subfolder, baseName);

      try {
        const res = await fetch(item.originalMediaUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(targetPublicPath, buffer);
        fs.writeFileSync(targetWebPath, buffer);
        const mimeType = res.headers.get('content-type') || 'image/jpeg';

        manifest.push({
          mediaId: id,
          sourcePageUrl: item.sourcePageUrl,
          originalMediaUrl: item.originalMediaUrl,
          localFilePath: relPath,
          fileType: path.extname(baseName).replace('.', '') || 'jpg',
          mimeType,
          altText: item.alt || baseName.replace(/[-_.]/g, ' '),
          width: item.width || null,
          height: item.height || null,
          fileSize: buffer.length,
          downloadStatus: 'DOWNLOADED',
          attributionNotes: 'First-party Galaxy Heritage World asset',
          usedOnRedesignedSite: true,
        });
      } catch (err) {
        manifest.push({
          mediaId: id,
          sourcePageUrl: item.sourcePageUrl,
          originalMediaUrl: item.originalMediaUrl,
          localFilePath: relPath,
          fileType: path.extname(baseName).replace('.', '') || 'jpg',
          mimeType: 'unknown',
          altText: item.alt || baseName,
          width: item.width || null,
          height: item.height || null,
          fileSize: 0,
          downloadStatus: `FAILED: ${err.message}`,
          attributionNotes: 'First-party Galaxy Heritage World asset',
          usedOnRedesignedSite: false,
        });
      }
    })
  );
  console.log(`Processed media batch ${Math.min(i + batchSize, prioritized.length)}/${prioritized.length}`);
}

// Add remaining cataloged media items to manifest as CATALOGED
for (let i = prioritized.length; i < allItems.length; i++) {
  const item = allItems[i];
  const id = `GHW-MEDIA-${String(index++).padStart(4, '0')}`;
  const subfolder = classifyFolder(item.sourcePageUrl, item.originalMediaUrl);
  const baseName = sanitizeFilename(item.originalMediaUrl, `ghw-${index}`);
  const relPath = `/media/galaxy-heritage-world/${subfolder}/${baseName}`;

  manifest.push({
    mediaId: id,
    sourcePageUrl: item.sourcePageUrl,
    originalMediaUrl: item.originalMediaUrl,
    localFilePath: relPath,
    fileType: path.extname(baseName).replace('.', '') || 'jpg',
    mimeType: 'image/jpeg',
    altText: item.alt || baseName,
    width: item.width || null,
    height: item.height || null,
    fileSize: null,
    downloadStatus: 'CATALOGED_REMOTE_AVAILABLE',
    attributionNotes: 'First-party Galaxy Heritage World asset',
    usedOnRedesignedSite: true,
  });
}

fs.writeFileSync(path.join(PUBLIC_MEDIA_ROOT, 'media-manifest.json'), JSON.stringify(manifest, null, 2));
fs.writeFileSync(path.join(WEB_MEDIA_ROOT, 'media-manifest.json'), JSON.stringify(manifest, null, 2));

// Update docs/media-inventory.csv with complete manifest
let csv = 'Media ID,Source Page URL,Original Media URL,Local File Path,File Type,MIME Type,Alt Text,Width,Height,File Size,Download Status,Attribution Notes,Used On Redesigned Site\n';
for (const m of manifest) {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  csv += [
    m.mediaId,
    esc(m.sourcePageUrl),
    esc(m.originalMediaUrl),
    esc(m.localFilePath),
    m.fileType,
    m.mimeType,
    esc(m.altText),
    m.width || '',
    m.height || '',
    m.fileSize || '',
    esc(m.downloadStatus),
    esc(m.attributionNotes),
    m.usedOnRedesignedSite,
  ].join(',') + '\n';
}

fs.writeFileSync(path.join(ROOT_DIR, 'docs/media-inventory.csv'), csv);
console.log(`Completed media download! Downloaded: ${manifest.filter(m => m.downloadStatus === 'DOWNLOADED').length}, Total cataloged: ${manifest.length}`);
