#!/bin/bash

# Generate blog cache and sitemap
npx tsx ./scripts/generate-blog-cache.ts
npx tsx ./scripts/generate-blog-sitemap.ts

# Start the scheduling service
npx tsx ./scripts/schedule-publish.ts