'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const VIATOR_BANNERS_SRC = 'https://partners.vtrcdn.com/static/scripts/banners/banners.js'
const VIATOR_WIDGET_SRC = 'https://www.viator.com/orion/partner/widget.js'
const GYG_WIDGET_SRC = 'https://widget.getyourguide.com/dist/pa.umd.production.min.js'

function addExternalScript(id: string, src: string, pathname: string, attributes: Record<string, string> = {}) {
  const script = document.createElement('script')
  script.id = id
  script.async = true
  script.src = src
  script.dataset.affiliatePath = pathname
  for (const [name, value] of Object.entries(attributes)) script.setAttribute(name, value)
  document.head.appendChild(script)
}

function ensureExternalScript(id: string, src: string, pathname: string, attributes: Record<string, string> = {}) {
  const existing = document.getElementById(id) as HTMLScriptElement | null
  if (existing?.dataset.affiliatePath === pathname) return
  existing?.parentElement?.removeChild(existing)
  addExternalScript(id, src, pathname, attributes)
}

function isUnfilled(el: HTMLElement) {
  // Availability placeholders contain GetYourGuide's required "Powered by"
  // fallback before hydration, so child-count alone cannot identify readiness.
  if (el.matches('div[data-gyg-widget]')) return !el.querySelector('iframe')
  return el.children.length === 0 && el.innerHTML.trim().length === 0
}

function markLoadedSlots() {
  const slots = Array.from(document.querySelectorAll<HTMLElement>('.affiliate-slot'))
  for (const slot of slots) {
    if (slot.classList.contains('is-loaded')) continue
    const placeholder =
      slot.querySelector<HTMLElement>('div[data-gyg-widget]') ||
      slot.querySelector<HTMLElement>('div[data-id="viator-banner"]') ||
      slot.querySelector<HTMLElement>('div[data-vi-partner-id]')
    if (!placeholder) continue
    if (!isUnfilled(placeholder)) slot.classList.add('is-loaded')
  }
}

export default function AffiliateScripts() {
  const pathname = usePathname()

  useEffect(() => {
    const init = () => {
      const gygPlaceholders = Array.from(document.querySelectorAll<HTMLElement>('div[data-gyg-widget]'))
      const bannerPlaceholders = Array.from(document.querySelectorAll<HTMLElement>('div[data-id="viator-banner"]'))
      const widgetPlaceholders = Array.from(document.querySelectorAll<HTMLElement>('div[data-vi-partner-id]'))

      if (gygPlaceholders.some(isUnfilled)) {
        const partnerId = gygPlaceholders[0]?.dataset.gygPartnerId || ''
        ensureExternalScript('getyourguide-widgets-js', GYG_WIDGET_SRC, pathname, {
          'data-gyg-partner-id': partnerId,
        })
      }

      if (bannerPlaceholders.length > 0) {
        const anyMissing = bannerPlaceholders.some(isUnfilled)
        if (anyMissing) {
          ensureExternalScript('viator-banners-js', VIATOR_BANNERS_SRC, pathname)
        }
      }

      if (widgetPlaceholders.length > 0) {
        const anyMissing = widgetPlaceholders.some(isUnfilled)
        if (anyMissing) {
          ensureExternalScript('viator-widgets-js', VIATOR_WIDGET_SRC, pathname)
        }
      }
    }

    const t1 = window.setTimeout(init, 0)
    const poll = window.setInterval(markLoadedSlots, 500)

    return () => {
      window.clearTimeout(t1)
      window.clearInterval(poll)
    }
  }, [pathname])

  return null
}
