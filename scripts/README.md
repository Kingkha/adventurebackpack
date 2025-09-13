# Blog Cache and Sitemap Generation

This directory contains scripts to generate the blog cache and sitemap for Adventure Backpack.

## Automatic Generation

The blog cache and sitemap are automatically generated during the Next.js build process. This ensures that:

1. The blog cache is always up-to-date with the latest content files
2. The sitemap.xml file is regenerated with the current content URLs

## Manual Generation

You can manually regenerate the cache and sitemap using the provided npm script:

```bash
npm run generate:cache-sitemap
```

## Programmatic Generation

You can also trigger generation programmatically from your code by importing the following functions from the `lib/getBlogPosts.ts` module:

```typescript
import { regenerateBlogCache, regenerateSitemap, regenerateCacheAndSitemap } from '../lib/getBlogPosts';

// Generate only the blog cache
regenerateBlogCache();

// Generate only the sitemap
regenerateSitemap();

// Generate both cache and sitemap
regenerateCacheAndSitemap();
```

## How It Works

- `generate-blog-cache.ts`: Scans the content directory for blog posts and creates a JSON cache file
- `generate-blog-sitemap.ts`: Uses the blog cache to generate a sitemap.xml file
- `generate-cache-and-sitemap.js`: Combines both scripts for convenience

The cache file is stored at `content/blog-cache.json` and the sitemap at `public/sitemap.xml`. 