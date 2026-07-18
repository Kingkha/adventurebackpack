'use client'

/**
 * AffiliateTracker
 * ----------------
 * Fires GA4 events for the sponsored widget + deep-link units injected by
 * `lib/affiliateLinks.ts`. Deep-link clicks are measured directly; interactions
 * inside cross-origin provider widgets use the iframe-focus heuristic.
 *
 * Events emitted (via window.gtag('event', ...), with a dataLayer fallback):
 *   - affiliate_impression     slot scrolled into view (>=50% for >=1s)
 *   - affiliate_widget_loaded  booking unit is ready (.is-loaded)
 *   - affiliate_click          user engaged a sponsored unit
 *   - outbound_click           user clicked any other external link
 *
 * Why two click paths: provider widgets run in cross-origin iframes, while
 * reusable deep links are normal anchors in the parent document.
 */

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

// Hosts that count as affiliate destinations (provider sites and widget CDNs).
const AFFILIATE_HOST_RE = /(?:^|\.)(viator\.com|vtrcdn\.com|getyourguide\.com|gyg\.me|stay22\.com|awin1\.com|booking\.com)$/i
const WRAPPER_SELECTOR = '.affiliate-slot, [data-aff-block]'
const PLACEHOLDER_SELECTOR = 'div[data-gyg-widget], div[data-vi-partner-id], div[data-id="viator-banner"]'
const UNIT_SELECTOR = `${WRAPPER_SELECTOR}, ${PLACEHOLDER_SELECTOR}`

// Per-DOM-node dedupe sets. Keyed on the live element, so client-side route
// changes (which build fresh slot nodes) naturally reset without manual clears.
const impressed = new WeakSet<Element>()
const loadedFired = new WeakSet<Element>()
const iframeClickAt = new WeakMap<Element, number>()

type AffiliateMeta = {
  partner: string
  widget_type: string
  format: string
  variant: string
  placement: string
  campaign: string
  location_id: string
  destination_id: string
  search_term: string
  tour_id?: string
}

function emit(eventName: string, params: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  const analyticsWindow = window as Window & typeof globalThis & {
    gtag?: (...args: unknown[]) => void
    dataLayer?: Array<Record<string, unknown>>
  }
  const payload = { page_path: window.location.pathname, ...params }
  if (typeof analyticsWindow.gtag === 'function') {
    analyticsWindow.gtag('event', eventName, payload)
  } else if (Array.isArray(analyticsWindow.dataLayer)) {
    // GA not booted yet (lazyOnload). Queue on the dataLayer so it isn't lost.
    analyticsWindow.dataLayer.push({ event: eventName, ...payload })
  }
}

// Read partner / widget type / campaign off the placeholder div inside a slot.
function readSlotMeta(slot: Element): AffiliateMeta {
  const unit = slot.matches('[data-affiliate-unit]')
    ? slot as HTMLElement
    : slot.querySelector<HTMLElement>('[data-affiliate-unit]')
  if (unit) {
    return {
      partner: unit.dataset.affiliateProvider || 'unknown',
      widget_type: unit.dataset.affiliateWidget || 'experience_finder',
      format: unit.dataset.affiliateFormat || 'widget',
      variant: unit.dataset.affiliateVariant || '',
      placement: unit.dataset.affiliatePlacement || '',
      campaign: unit.dataset.affiliateCampaign || '',
      location_id: unit.dataset.affiliateLocationId || '',
      destination_id: '',
      search_term: unit.dataset.affiliateCity || '',
      tour_id: unit.dataset.affiliateTourId || '',
    }
  }
  const bookingOptions = slot.matches('[data-affiliate-widget="booking_options"]')
    ? slot as HTMLElement
    : slot.querySelector<HTMLElement>('[data-affiliate-widget="booking_options"]')
  if (bookingOptions) {
    return {
      partner: 'multiple',
      widget_type: 'booking_options',
      format: 'deeplink',
      variant: '',
      placement: bookingOptions.dataset.affiliatePlacement || '',
      campaign: bookingOptions.dataset.affiliateCampaign || '',
      location_id: '',
      destination_id: '',
      search_term: bookingOptions.dataset.affiliateCity || '',
    }
  }
  const gyg = slot.matches('div[data-gyg-widget]')
    ? slot as HTMLElement
    : slot.querySelector<HTMLElement>('div[data-gyg-widget]')
  if (gyg) {
    return {
      partner: 'getyourguide',
      widget_type: `gyg_${gyg.dataset.gygWidget || 'widget'}`,
      format: 'widget',
      variant: '',
      placement: '',
      campaign: gyg.dataset.gygCampaign || gyg.dataset.gygCmp || '',
      location_id: gyg.dataset.gygLocationId || '',
      destination_id: '',
      search_term: '',
    }
  }
  const vi = slot.matches('div[data-vi-partner-id]')
    ? slot as HTMLElement
    : slot.querySelector<HTMLElement>('div[data-vi-partner-id]')
  if (vi) {
    return {
      partner: 'viator',
      widget_type: 'viator_auto',
      format: 'widget',
      variant: '',
      placement: '',
      campaign: vi.dataset.viCampaign || vi.dataset.campaign || '',
      location_id: '',
      destination_id: '',
      search_term: vi.dataset.viSearchTerm || '',
    }
  }
  const banner = slot.matches('div[data-id="viator-banner"]')
    ? slot as HTMLElement
    : slot.querySelector<HTMLElement>('div[data-id="viator-banner"]')
  if (banner) {
    return { partner: 'viator', widget_type: 'viator_banner', format: 'widget', variant: '', placement: '', campaign: '', location_id: '', destination_id: '', search_term: '' }
  }
  return { partner: 'unknown', widget_type: 'unknown', format: 'unknown', variant: '', placement: '', campaign: '', location_id: '', destination_id: '', search_term: '' }
}

function partnerFromHost(host: string): string {
  if (/viator\.com|vtrcdn\.com/i.test(host)) return 'viator'
  if (/getyourguide\.com|gyg\.me/i.test(host)) return 'getyourguide'
  if (/stay22\.com/i.test(host)) return 'stay22'
  if (/awin1\.com|booking\.com/i.test(host)) return 'booking'
  return 'other'
}

function collectUnits(): HTMLElement[] {
  const units = new Set<HTMLElement>()
  document.querySelectorAll<HTMLElement>(WRAPPER_SELECTOR).forEach((unit) => units.add(unit))
  document.querySelectorAll<HTMLElement>(PLACEHOLDER_SELECTOR).forEach((placeholder) => {
    if (!placeholder.closest(WRAPPER_SELECTOR)) units.add(placeholder)
  })
  return [...units]
}

function placeholderOf(unit: HTMLElement): HTMLElement | null {
  if (unit.matches(PLACEHOLDER_SELECTOR)) return unit
  return unit.querySelector<HTMLElement>(PLACEHOLDER_SELECTOR)
}

function isWidgetReady(unit: HTMLElement): boolean {
  if (unit.classList.contains('is-loaded')) return true
  const placeholder = placeholderOf(unit)
  if (!placeholder) return false
  if (placeholder.matches('div[data-gyg-widget]')) return !!placeholder.querySelector('iframe')
  return placeholder.children.length > 0 || placeholder.innerHTML.trim().length > 0
}

export default function AffiliateTracker() {
  const pathname = usePathname()

  useEffect(() => {
    const slots = collectUnits()

    // ── 1. Impressions ──────────────────────────────────────────────────────
    // Count a slot as seen when >=50% visible for a continuous 1s (standard
    // viewability), then stop observing it. Pending timers per slot.
    const pending = new Map<Element, number>()
    let io: IntersectionObserver | null = null
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const slot = entry.target
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
              if (pending.has(slot) || impressed.has(slot)) continue
              const timer = window.setTimeout(() => {
                pending.delete(slot)
                if (impressed.has(slot)) return
                impressed.add(slot)
                io?.unobserve(slot)
                emit('affiliate_impression', readSlotMeta(slot))
              }, 1000)
              pending.set(slot, timer)
            } else {
              // Left the viewport before the dwell completed — cancel.
              const timer = pending.get(slot)
              if (timer !== undefined) {
                window.clearTimeout(timer)
                pending.delete(slot)
              }
            }
          }
        },
        { threshold: [0, 0.5, 1] },
      )
      for (const slot of slots) {
        if (!impressed.has(slot)) io.observe(slot)
      }
    }

    // ── 2. Widget loaded ─────────────────────────────────────────────────────
    // Wrapped widgets flip `.is-loaded`; legacy/entity widgets may be bare.
    // Observe both contracts so every live portfolio route is measurable.
    const classObservers: MutationObserver[] = []
    const fireLoaded = (slot: Element) => {
      if (loadedFired.has(slot)) return
      loadedFired.add(slot)
      emit('affiliate_widget_loaded', readSlotMeta(slot))
    }
    for (const slot of slots) {
      if (isWidgetReady(slot)) {
        fireLoaded(slot)
        continue
      }
      const mo = new MutationObserver(() => {
        if (isWidgetReady(slot)) {
          fireLoaded(slot)
          mo.disconnect()
        }
      })
      mo.observe(slot, { attributes: true, attributeFilter: ['class'], childList: true, subtree: true })
      classObservers.push(mo)
    }

    // ── 3. Real link clicks (affiliate + generic outbound) ───────────────────
    // Capture phase so we record the click even if the handler/navigation runs.
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const a = target?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!a) return

      let host = ''
      try {
        host = new URL(a.href, window.location.href).hostname
      } catch {
        return
      }

      const slot = a.closest(UNIT_SELECTOR)
      const isAffiliate = AFFILIATE_HOST_RE.test(host) || !!slot
      if (isAffiliate) {
        const meta = slot ? readSlotMeta(slot) : null
        const provider = a.dataset.affiliateProvider || meta?.partner || partnerFromHost(host)
        emit('affiliate_click', {
          partner: provider,
          widget_type: ['deeplink', 'product_deeplink'].includes(a.dataset.affiliateFormat || '')
            ? a.dataset.affiliateFormat || 'deeplink'
            : meta?.widget_type || 'text_link',
          format: a.dataset.affiliateFormat || meta?.format || 'deeplink',
          variant: a.dataset.affiliateVariant || meta?.variant || '',
          campaign: a.dataset.affiliateCampaign || meta?.campaign || '',
          location_id: a.dataset.affiliateLocationId || meta?.location_id || '',
          destination_id: a.dataset.affiliateDestinationId || meta?.destination_id || '',
          placement: a.dataset.affiliatePlacement || meta?.placement || '',
          search_term: meta?.search_term || '',
          tour_id: a.dataset.affiliateTourId || meta?.tour_id || '',
          link_url: a.href,
          method: 'link',
        })
        return
      }

      // Generic outbound (any other host than ours).
      if (host && host !== window.location.hostname) {
        emit('outbound_click', { link_url: a.href, link_domain: host })
      }
    }
    document.addEventListener('click', onClick, true)
    // Middle-click / cmd-click open in a new tab without a `click` — catch those.
    document.addEventListener('auxclick', onClick as EventListener, true)

    // ── 4. Widget iframe clicks (focus/blur heuristic) ───────────────────────
    // When a cross-origin iframe is clicked the browser focuses the <iframe>
    // element; the parent window fires `blur` and document.activeElement is the
    // iframe. If that iframe lives in an affiliate slot, count it as a click.
    const onBlur = () => {
      // Defer one tick so document.activeElement settles to the iframe.
      window.setTimeout(() => {
        const el = document.activeElement
        if (!el || el.tagName !== 'IFRAME') return
        const slot = el.closest(UNIT_SELECTOR)
        if (!slot) return
        const now = Date.now()
        const last = iframeClickAt.get(slot) || 0
        if (now - last < 1000) return // debounce repeated blur firings
        iframeClickAt.set(slot, now)
        emit('affiliate_click', { ...readSlotMeta(slot), link_url: '', method: 'iframe_focus' })
      }, 0)
    }
    window.addEventListener('blur', onBlur)

    return () => {
      for (const timer of pending.values()) window.clearTimeout(timer)
      pending.clear()
      io?.disconnect()
      for (const mo of classObservers) mo.disconnect()
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('auxclick', onClick as EventListener, true)
      window.removeEventListener('blur', onBlur)
    }
  }, [pathname])

  return null
}
