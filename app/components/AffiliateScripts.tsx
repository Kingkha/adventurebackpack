'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const VIATOR_BANNERS_SRC = 'https://partners.vtrcdn.com/static/scripts/banners/banners.js'
const VIATOR_WIDGET_SRC = 'https://www.viator.com/orion/partner/widget.js'

function ensureExternalScript(id: string, src: string) {
  if (document.getElementById(id)) return
  const script = document.createElement('script')
  script.id = id
  script.async = true
  script.src = src
  document.head.appendChild(script)
}

function reloadExternalScript(id: string, src: string) {
  const existing = document.getElementById(id)
  existing?.parentElement?.removeChild(existing)

  const script = document.createElement('script')
  script.id = id
  script.async = true
  script.src = src
  document.head.appendChild(script)
}

function isUnfilled(el: HTMLElement) {
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

function relocateSidebarBanner() {
  if (typeof window === 'undefined') return
  if (!window.matchMedia('(min-width: 1024px)').matches) return

  const slot = document.querySelector<HTMLElement>('.affiliate-sidebar-slot')
  if (!slot) return

  const existingInSlot = slot.querySelector<HTMLElement>('.sidebar-banner-container')
  if (existingInSlot) return

  const banner = document.querySelector<HTMLElement>('.sidebar-banner-container')
  if (!banner) return

  slot.appendChild(banner)
}

export default function AffiliateScripts() {
  const pathname = usePathname()

  useEffect(() => {
    const init = (forceReload = false) => {
      relocateSidebarBanner()

      const bannerPlaceholders = Array.from(document.querySelectorAll<HTMLElement>('div[data-id="viator-banner"]'))
      const widgetPlaceholders = Array.from(document.querySelectorAll<HTMLElement>('div[data-vi-partner-id]'))

      if (bannerPlaceholders.length > 0) {
        const anyMissing = bannerPlaceholders.some(isUnfilled)
        if (anyMissing) {
          if (forceReload) reloadExternalScript('viator-banners-js', VIATOR_BANNERS_SRC)
          else ensureExternalScript('viator-banners-js', VIATOR_BANNERS_SRC)
        }
      }

      if (widgetPlaceholders.length > 0) {
        const anyMissing = widgetPlaceholders.some(isUnfilled)
        if (anyMissing) {
          if (forceReload) reloadExternalScript('viator-widgets-js', VIATOR_WIDGET_SRC)
          else ensureExternalScript('viator-widgets-js', VIATOR_WIDGET_SRC)
        }
      }
    }

    const t1 = window.setTimeout(() => init(false), 0)
    const poll = window.setInterval(markLoadedSlots, 500)

    return () => {
      window.clearTimeout(t1)
      window.clearInterval(poll)
    }
  }, [pathname])

  return null
}
