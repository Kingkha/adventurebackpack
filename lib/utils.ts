import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Re-export tag governance from the single source of truth (config/tags.ts).
// Any code that needs CANONICAL_TAGS, GENERIC_TAGS, MAX_TAG_LENGTH, or
// TAG_DESCRIPTIONS should import from here OR directly from config/tags.
export {
  CANONICAL_TAGS,
  GENERIC_TAGS,
  MAX_TAG_LENGTH,
  MIN_POSTS_PER_HUB,
  TAG_DESCRIPTIONS,
} from "@/config/tags"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function tagToSlug(tag: string): string {
  return tag
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function getTagsForSlug(slug: string, allTags: string[]): string[] {
  return allTags.filter((tag) => tagToSlug(tag) === slug)
}

// Function to decode HTML entities (server-safe)
export function decodeHtmlEntities(text: string): string {
  if (!text) return text
  
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)))
    .replace(/&#x([a-fA-F0-9]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
}
