# Scripts Directory

This directory contains utility scripts for the blog site.

## Scripts

- `generate-blog-cache.ts` - Generates a JSON cache of all blog posts for faster loading
- `generate-blog-sitemap.ts` - Generates an XML sitemap for SEO
- `submit-indexnow-from-sitemap.ts` - Submits sitemap URLs to IndexNow (Bing/Yandex/etc.)
- `generate-indexnow-key.ts` - Generates an IndexNow key and writes `public/<key>.txt`
- `remove-broken-internal-links.ts` - Removes non-existing internal links from blog articles
- `update-footer-hub-pillar.ts` - Updates `app/components/Footer.tsx` to show Country Hub + Hub + Pillar links
- `fix-url-encoding.ts` - Fixes URL encoding issues in internal links (e.g., %C3%A0 → à)

## Usage

Most scripts are automatically run during the build process via the `npm run build` command.

### Manual Script Execution

- `npm run clean-links` - Remove broken internal links from blog articles
- `npm run fix-encoding` - Fix URL encoding issues in internal links
- `INDEXNOW_KEY=... npm run indexnow` - Submit all URLs from `public/sitemap.xml` to IndexNow
  - Ensure the key file is publicly reachable at `https://<host>/<key>.txt` (or set `INDEXNOW_KEY_LOCATION`)
- `npm run indexnow:key` - Generate a key and write `public/<key>.txt`

The `remove-broken-internal-links.ts` script:
- Reads the sitemap.xml to get all valid URLs
- Scans all HTML files in ALL content directories (blog/, italy/, spain/, etc.)
- Identifies internal links to your domain (configured in lib/siteConfig.ts, excluding CDN links)
- Removes links that don't exist in the sitemap
- Replaces broken link tags with their text content
- Processes thousands of files across all country folders

The `fix-url-encoding.ts` script:
- Reads the sitemap.xml to get all valid URLs
- Scans all HTML files for internal links with URL encoding issues
- Fixes common encodings like %C3%A0 → à, %C3%A7 → ç, etc.
- Only fixes links that exist in the sitemap after decoding
- Preserves link functionality while fixing display issues 
