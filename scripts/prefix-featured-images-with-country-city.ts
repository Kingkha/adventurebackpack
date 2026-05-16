#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

function listHtmlFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listHtmlFiles(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

function parseCountryCity(filePath: string): { country: string; city: string } | null {
  const rel = path.relative(CONTENT_ROOT, filePath);
  const parts = rel.split(path.sep);
  if (parts.length !== 3) return null;
  const [country, city] = parts;
  if (!country || !city) return null;
  return { country, city };
}

function updateFeaturedImageFrontMatter(frontMatter: string, country: string, city: string): {
  updated: string;
  changed: boolean;
  before?: string;
  after?: string;
} {
  const regex =
    /^featuredImage:\s*(["']?)(\/images\/([^\/\r\n"']+))\1\s*$/m;

  const match = frontMatter.match(regex);
  if (!match) return { updated: frontMatter, changed: false };

  const quote = match[1] || '"';
  const currentPath = match[2];
  const baseName = match[3];
  const prefixedPath = `/images/${country}/${city}/${baseName}`;

  if (currentPath === prefixedPath) return { updated: frontMatter, changed: false };

  const replaced = frontMatter.replace(regex, `featuredImage: ${quote}${prefixedPath}${quote}`);
  return { updated: replaced, changed: true, before: currentPath, after: prefixedPath };
}

function updateFile(filePath: string): { changed: boolean; before?: string; after?: string } {
  const location = parseCountryCity(filePath);
  if (!location) return { changed: false };

  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n/);
  if (!match) return { changed: false };

  const frontMatter = match[1];
  const { updated, changed, before, after } = updateFeaturedImageFrontMatter(
    frontMatter,
    location.country,
    location.city
  );
  if (!changed) return { changed: false };

  const frontMatterFull = match[0];
  const newline = frontMatterFull.includes('\r\n') ? '\r\n' : '\n';
  const updatedFrontMatterFull = `---${newline}${updated}${newline}---${newline}`;
  const body = content.slice(frontMatterFull.length);
  const updatedContent = updatedFrontMatterFull + body;

  fs.writeFileSync(filePath, updatedContent, 'utf-8');
  return { changed: true, before, after };
}

function main(): void {
  if (!fs.existsSync(CONTENT_ROOT)) {
    console.error(`content/ not found at ${CONTENT_ROOT}`);
    process.exit(1);
  }

  const htmlFiles = listHtmlFiles(CONTENT_ROOT);
  let changedCount = 0;
  let skippedCount = 0;

  for (const filePath of htmlFiles) {
    const result = updateFile(filePath);
    if (result.changed) {
      changedCount++;
      continue;
    }
    skippedCount++;
  }

  console.log(`✅ Updated featuredImage in ${changedCount} files`);
  console.log(`↩️  Skipped ${skippedCount} files (no change needed)`);
}

main();

