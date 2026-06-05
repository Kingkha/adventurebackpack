// Ambient global augmentations.

export {}

declare global {
  interface Window {
    /** Google Analytics gtag, defined by the inline GA bootstrap script. */
    gtag?: (...args: unknown[]) => void
    /** GA data layer queue. */
    dataLayer?: unknown[]
  }
}
