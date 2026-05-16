/**
 * Affiliate Links Manager
 * Inserts search-based affiliate widgets into blog post HTML.
 * Deep-URL Viator variants (banner / sidebar / "Insider Tip" CTA boxes)
 * were removed — they were too aggressive and Viator has reduced commission
 * on deep-link traffic anyway.
 */

import { findCityData, convertCityToUrlFriendly, extractCityFromTags } from './citiesData';
import { siteConfig } from './siteConfig';

const VIATOR_PARTNER_ID = siteConfig.affiliate.viatorPartnerId;
const GETYOURGUIDE_PARTNER_ID = siteConfig.affiliate.getyourguidePartnerId;
const VIATOR_WIDGET_REF = siteConfig.affiliate.viatorWidgetRef;
const DOMAIN_NAME = siteConfig.affiliate.domainName;

/**
 * Build a campaign value that encodes site + widget type + source page.
 * Viator attribution docs require alphanumeric + dash only; non-matching
 * chars collapse to dashes. Capped to stay under platform-observed ~100 char
 * soft limits. Emitted verbatim on Viator as data-campaign/data-vi-campaign
 * and on GYG as data-gyg-campaign.
 */
function buildCampaign(widgetType: string, pageSlug: string): string {
  const slug = (pageSlug || '')
    .replace(/^\/+|\/+$/g, '')
    .replace(/\.html$/i, '')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '');
  return slug ? `${DOMAIN_NAME}-${widgetType}-${slug}` : `${DOMAIN_NAME}-${widgetType}`;
}

// Wrap third-party affiliate widgets in a fixed-height shell so the placeholder
// occupies its final size before the external script hydrates. Prevents the
// 400-800px CLS shift on mobile that GYG/Viator iframes cause when they paint.
function sponsoredSlot(innerHtml: string, minHeightPx: number): string {
  return `<div class="affiliate-slot" data-nosnippet style="min-height:${minHeightPx}px">
  <span class="affiliate-badge">Sponsored</span>
  <div class="affiliate-skeleton" aria-hidden="true"></div>
  <div class="affiliate-inner">${innerHtml}</div>
</div>`;
}

function generateGYGCityWidget(gygLocationId: string, pageSlug: string): string {
  const campaign = buildCampaign('gcity', pageSlug);
  const inner = `<div
    data-gyg-href="https://widget.getyourguide.com/default/city.frame"
    data-gyg-location-id="${gygLocationId}"
    data-gyg-locale-code="en-US"
    data-gyg-widget="city"
    data-gyg-partner-id="${GETYOURGUIDE_PARTNER_ID}"
    data-gyg-campaign="${campaign}"
    data-gyg-cmp="${campaign}"
    loading="lazy"
></div>`;
  return sponsoredSlot(inner, 520);
}

function generateGYGActivitiesWidget(gygLocationId: string, pageSlug: string): string {
  const campaign = buildCampaign('gact', pageSlug);
  const inner = `<div
    data-gyg-href="https://widget.getyourguide.com/default/activities.frame"
    data-gyg-location-id="${gygLocationId}"
    data-gyg-locale-code="en-US"
    data-gyg-widget="activities"
    data-gyg-partner-id="${GETYOURGUIDE_PARTNER_ID}"
    data-gyg-number-of-items="4"
    data-gyg-campaign="${campaign}"
    data-gyg-cmp="${campaign}"
    loading="lazy"
></div>`;
  return sponsoredSlot(inner, 420);
}

function generateViatorAutoWidget(city: string, pageSlug: string): string {
  const citySearch = convertCityToUrlFriendly(city);
  const campaign = buildCampaign('vauto', pageSlug);
  const inner = `<div
    data-vi-partner-id="${VIATOR_PARTNER_ID}"
    data-vi-widget-ref="${VIATOR_WIDGET_REF}"
    data-vi-search-term="${citySearch}"
    data-vi-campaign="${campaign}"
    data-campaign="${campaign}"
></div>`;
  return sponsoredSlot(inner, 600);
}

type AffiliateContext = {
  cityName: string;
  gygLocationId: string;
};

function buildAffiliateContext(tags: string[]): AffiliateContext | null {
  const cityName = extractCityFromTags(tags);
  if (!cityName) {
    return null;
  }

  const cityData = findCityData(cityName);

  return {
    cityName,
    gygLocationId: cityData?.getyourguideLocationId || '1634',
  };
}

// Strip aggressive inline Viator deep-link anchors sprinkled into prose by the
// content generator (e.g. <a href="https://www.viator.com/Bangkok/d343?pid=…">
// guided tours</a>). These tank readability + commission rate vs. the curated
// search widgets we inject below, so we unwrap them and keep just the anchor
// text. Runs on every article (including hub pages) via processAffiliateLinks.
function stripInlineViatorLinks(html: string): string {
  return html.replace(
    /<a[^>]*href=["']https?:\/\/(?:www\.)?viator\.com\/[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi,
    '$1'
  );
}

function removeExistingWidgets(html: string): string {
  // Strip prior sponsoredSlot wrappers (re-injected fresh below). Use a
  // balanced-ish match — affiliate slots contain nested divs, so a non-greedy
  // single-div regex would leave the outer wrapper behind. The slot block
  // always ends with the inner widget div, so we anchor on the wrapper class.
  html = html.replace(/<div[^>]*class="affiliate-slot"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi, '');

  // Strip GYG widgets (re-injected fresh below)
  html = html.replace(/<div[^>]*data-gyg-widget[^>]*>[\s\S]*?<\/div>/gi, '');
  html = html.replace(/<div[^>]*data-gyg-partner-id[^>]*>[\s\S]*?<\/div>/gi, '');
  html = html.replace(/<script[^>]*widget\.getyourguide\.com[^>]*>[\s\S]*?<\/script>/gi, '');

  // Strip Viator search widget (re-injected) and deprecated deep-link variants
  html = html.replace(/<div[^>]*data-id="viator-banner"[^>]*>[\s\S]*?<\/div>/gi, '');
  html = html.replace(/<div[^>]*data-vi-partner-id[^>]*>[\s\S]*?<\/div>/gi, '');
  html = html.replace(/<script[^>]*viator\.com[^>]*>[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<script[^>]*partners\.vtrcdn\.com[^>]*>[\s\S]*?<\/script>/gi, '');

  // Strip deprecated wrappers (deep-URL banners + sidebar + Pro Tip CTA boxes)
  html = html.replace(/<div[^>]*class="sidebar-banner-container"[^>]*>[\s\S]*?<\/div>/gi, '');
  html = html.replace(/<div[^>]*id="sidebar-banner"[^>]*>[\s\S]*?<\/div>/gi, '');
  html = html.replace(/<blockquote><p><strong>(?:Tip|Pro Tip|Recommendation|Insider Tip):<\/strong>[\s\S]*?viator\.com[\s\S]*?<\/p><\/blockquote>/gi, '');

  return html;
}

export function insertAffiliateLinks(
  htmlContent: string,
  tags: string[] = [],
  pageSlug: string = '',
): string {
  const lowerCaseTags = tags.map(tag => String(tag).toLowerCase());
  if (lowerCaseTags.includes('hub page') || lowerCaseTags.includes('country hub')) {
    return htmlContent;
  }

  const context = buildAffiliateContext(tags);
  if (!context) {
    return htmlContent;
  }

  const { cityName, gygLocationId } = context;

  let processedHtml = removeExistingWidgets(htmlContent);

  // Top of article (after H1): GYG city widget only. The Viator widget moves
  // deeper into the article (mid-content slot) so it doesn't crowd the
  // intro — placing it directly under or near the GYG city widget reads as
  // aggressive ad stacking.
  const cityWidget = generateGYGCityWidget(gygLocationId, pageSlug);
  const h1Match = processedHtml.match(/<h1[^>]*>[\s\S]*?<\/h1>/i);
  if (h1Match) {
    processedHtml = processedHtml.replace(h1Match[0], h1Match[0] + '\n' + cityWidget);
  } else {
    const firstPMatch = processedHtml.match(/<p[^>]*>[\s\S]*?<\/p>/i);
    if (firstPMatch) {
      processedHtml = processedHtml.replace(firstPMatch[0], firstPMatch[0] + '\n' + cityWidget);
    } else {
      processedHtml = cityWidget + '\n' + processedHtml;
    }
  }

  const h2Regex = /<h2[^>]*>[\s\S]*?<\/h2>/gi;
  const h2Matches = [...processedHtml.matchAll(h2Regex)];

  if (h2Matches.length === 0) {
    return processedHtml;
  }

  // Mid-content widgets: H2 #1 → GYG activities, H2 #3 → Viator auto.
  // Layout: GYG city at top + GYG activities mid + Viator auto deeper.
  // Drops the previous "pre-first-H2 Viator" slot that read as crowding the
  // GYG city widget above it. Total = 3 widgets per page (down from 4).
  const widgetSlots: Array<{ h2Index: number; type: 'viator_auto' | 'gyg_activities' }> = [
    { h2Index: 1, type: 'gyg_activities' },
    { h2Index: 3, type: 'viator_auto' },
  ];

  // Walk slots in reverse so earlier indices aren't shifted by insertions.
  for (let s = widgetSlots.length - 1; s >= 0; s--) {
    const { h2Index, type } = widgetSlots[s];
    if (h2Index >= h2Matches.length) continue;

    let widgetHtml = '';
    switch (type) {
      case 'gyg_activities':
        widgetHtml = generateGYGActivitiesWidget(gygLocationId, pageSlug);
        break;
      case 'viator_auto':
        widgetHtml = generateViatorAutoWidget(cityName, pageSlug);
        break;
    }

    const i = h2Index;

    if (widgetHtml) {
      const h2Text = h2Matches[i][0];
      const h2Position = processedHtml.lastIndexOf(h2Text);
      if (h2Position !== -1) {
        processedHtml =
          processedHtml.substring(0, h2Position + h2Text.length) +
          '\n' + widgetHtml +
          processedHtml.substring(h2Position + h2Text.length);
      }
    }
  }

  return processedHtml;
}

function isAffiliateEnabled(): boolean {
  const enabled = process.env.AFFILIATE_ENABLED;
  if (enabled === undefined || enabled === null || enabled === '') return true;
  const normalizedValue = enabled.toLowerCase().trim();
  if (normalizedValue === 'false' || normalizedValue === '0' || normalizedValue === 'no') return false;
  if (normalizedValue === 'true' || normalizedValue === '1' || normalizedValue === 'yes') return true;
  return true;
}

export function processAffiliateLinks(
  content: string,
  tags: string[] = [],
  pageSlug: string = '',
): string {
  if (!isAffiliateEnabled()) {
    return content;
  }

  try {
    // Strip inline Viator deep-link anchors first so they're removed even on
    // hub-page articles (where insertAffiliateLinks short-circuits).
    const stripped = stripInlineViatorLinks(content);
    return insertAffiliateLinks(stripped, tags, pageSlug);
  } catch (error) {
    console.error('❌ Error processing affiliate links:', error);
    return content;
  }
}
