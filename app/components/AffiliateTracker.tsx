'use client'

/**
 * AffiliateTracker  (itinerary-maker)
 * -----------------------------------
 * Fires GA4 events for the Viator / GetYourGuide widgets injected by
 * `lib/affiliateLinks.ts`. Pairs with <AffiliateScripts /> (which loads the
 * third-party scripts) — this component only observes and reports, it never
 * mutates the widgets.
 *
 * Port note: unlike the japanactivity build, itinerary-maker does NOT wrap
 * widgets in a `.affiliate-slot` shell and has no `.is-loaded` flag. So here we
 * treat each widget PLACEHOLDER div as the slot and detect "loaded" by watching
 * the placeholder fill with the third-party iframe/banner.
 *
 * Events emitted (via window.gtag('event', ...), with a dataLayer fallback):
 *   - affiliate_impression     placeholder scrolled into view (>=50% for >=1s)
 *   - affiliate_widget_loaded  third-party script filled the placeholder
 *   - affiliate_click          link click (method: link) OR cross-origin iframe
 *                              engagement (method: iframe_focus)
 *   - outbound_click           any other external link
 *
 * Every affiliate event carries partner ('viator' | 'getyourguide') +
 * widget_type, so Viator vs GetYourGuide clicks and impressions separate
 * cleanly in GA4. Register `partner` + `widget_type` as Event-scoped custom
 * dimensions to break the events down per network.
 *
 * Why two click paths:
 *   GYG/Viator widgets render inside CROSS-ORIGIN iframes, so clicks inside them
 *   never bubble to the parent document and cannot be read directly. We capture
 *   them with the standard iframe focus/blur heuristic: clicking a cross-origin
 *   iframe focuses the <iframe> element, the parent window fires `blur`, and
 *   document.activeElement becomes that iframe. Real <a> affiliate links (Viator
 *   banners, inline text links) are captured directly via click delegation.
 */

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

// Hosts that count as affiliate destinations (covers Viator + GetYourGuide CDNs).
const AFFILIATE_HOST_RE = /(?:^|\.)(viator\.com|vtrcdn\.com|getyourguide\.com|gyg\.me)$/i

// Widget placeholder divs injected by lib/affiliateLinks.ts. Each placeholder IS
// the slot (no wrapper element in this project); the third-party script later
// fills it with an iframe / banner anchor.
const SLOT_SELECTOR =
  'div[data-gyg-widget],div[data-vi-partner-id],div[data-id="viator-banner"]'

// Per-DOM-node dedupe sets. Keyed on the live element, so client-side route
// changes (which build fresh placeholder nodes) naturally reset without manual
// clears.
const impressed = new WeakSet<Element>()
const loadedFired = new WeakSet<Element>()
const iframeClickAt = new WeakMap<Element, number>()

type AffiliateMeta = {
  partner: string
  widget_type: string
  campaign: string
  location_id: string
  search_term: string
}

function emit(eventName: string, params: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  const payload = { page_path: window.location.pathname, ...params }
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, payload)
  } else if (Array.isArray(window.dataLayer)) {
    // GA not booted yet (lazyOnload). Queue on the dataLayer so it isn't lost.
    window.dataLayer.push({ event: eventName, ...payload })
  }
}

// Resolve the placeholder element (the slot itself, or the nearest descendant
// placeholder if an ancestor was passed in) and read partner / widget metadata.
function readSlotMeta(el: Element): AffiliateMeta {
  const pick = (sel: string): HTMLElement | null =>
    (el.matches?.(sel) ? el : el.querySelector(sel)) as HTMLElement | null

  const gyg = pick('div[data-gyg-widget]')
  if (gyg) {
    return {
      partner: 'getyourguide',
      widget_type: `gyg_${gyg.dataset.gygWidget || 'widget'}`,
      campaign: gyg.dataset.gygCampaign || gyg.dataset.gygCmp || '',
      location_id: gyg.dataset.gygLocationId || '',
      search_term: '',
    }
  }
  const banner = pick('div[data-id="viator-banner"]')
  if (banner) {
    return {
      partner: 'viator',
      widget_type: 'viator_banner',
      campaign: banner.dataset.campaign || '',
      location_id: '',
      search_term: '',
    }
  }
  const vi = pick('div[data-vi-partner-id]')
  if (vi) {
    return {
      partner: 'viator',
      widget_type: 'viator_auto',
      campaign: vi.dataset.viCampaign || vi.dataset.campaign || '',
      location_id: '',
      search_term: vi.dataset.viSearchTerm || '',
    }
  }
  return { partner: 'unknown', widget_type: 'unknown', campaign: '', location_id: '', search_term: '' }
}

function partnerFromHost(host: string): string {
  if (/viator\.com|vtrcdn\.com/i.test(host)) return 'viator'
  if (/getyourguide\.com|gyg\.me/i.test(host)) return 'getyourguide'
  return 'other'
}

// A placeholder counts as "loaded" once the third-party script injects content
// (an iframe, banner anchor, or any child node) into the previously empty div.
function isFilled(el: Element): boolean {
  return el.children.length > 0 || (el.textContent || '').trim().length > 0
}

export default function AffiliateTracker() {
  const pathname = usePathname()

  useEffect(() => {
    const slots = Array.from(document.querySelectorAll<HTMLElement>(SLOT_SELECTOR))

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
    // No `.is-loaded` flag in this project — detect the third-party fill directly
    // by watching the placeholder gain child content (fire once, then stop).
    const loadObservers: MutationObserver[] = []
    const fireLoaded = (slot: Element) => {
      if (loadedFired.has(slot)) return
      loadedFired.add(slot)
      emit('affiliate_widget_loaded', readSlotMeta(slot))
    }
    for (const slot of slots) {
      if (isFilled(slot)) {
        fireLoaded(slot)
        continue
      }
      const mo = new MutationObserver(() => {
        if (isFilled(slot)) {
          fireLoaded(slot)
          mo.disconnect()
        }
      })
      mo.observe(slot, { childList: true, subtree: true })
      loadObservers.push(mo)
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

      const slot = a.closest(SLOT_SELECTOR)
      const isAffiliate = AFFILIATE_HOST_RE.test(host) || !!slot
      if (isAffiliate) {
        const meta = slot ? readSlotMeta(slot) : null
        emit('affiliate_click', {
          partner: meta?.partner || partnerFromHost(host),
          widget_type: meta?.widget_type || 'text_link',
          campaign: meta?.campaign || '',
          location_id: meta?.location_id || '',
          search_term: meta?.search_term || '',
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
    // iframe. If that iframe lives in an affiliate placeholder, count it as a
    // click.
    const onBlur = () => {
      // Defer one tick so document.activeElement settles to the iframe.
      window.setTimeout(() => {
        const el = document.activeElement
        if (!el || el.tagName !== 'IFRAME') return
        const slot = el.closest(SLOT_SELECTOR)
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
      for (const mo of loadObservers) mo.disconnect()
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('auxclick', onClick as EventListener, true)
      window.removeEventListener('blur', onBlur)
    }
  }, [pathname])

  return null
}
