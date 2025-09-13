import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to decode HTML entities
export function decodeHtmlEntities(text: string): string {
  if (!text) return text
  
  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
}

// Server-side version for use in API routes and SSR
export function decodeHtmlEntitiesServer(text: string): string {
  if (!text) return text
  
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
}
