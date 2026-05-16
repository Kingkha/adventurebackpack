export function encodePathSegments(pathValue: string): string {
  return pathValue
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/")
}

export function toAbsoluteUrl(baseUrl: string, maybeRelativeUrl: string): string {
  if (!maybeRelativeUrl) return baseUrl
  if (/^https?:\/\//i.test(maybeRelativeUrl)) return maybeRelativeUrl
  if (maybeRelativeUrl.startsWith("/")) return `${baseUrl}${maybeRelativeUrl}`
  return `${baseUrl}/${maybeRelativeUrl}`
}

export function toISODate(dateValue: unknown): string {
  const parsed = new Date(dateValue as any)
  if (Number.isNaN(parsed.getTime())) return new Date().toISOString()
  return parsed.toISOString()
}

export function buildCanonicalUrl(baseUrl: string, pathSegments: string[]): string {
  const encoded = pathSegments.map((segment) => encodeURIComponent(segment)).join("/")
  return encoded ? `${baseUrl}/${encoded}` : baseUrl
}
