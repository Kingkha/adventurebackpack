/**
 * Reusable, density-controlled affiliate widget injection.
 *
 * Only exact city/country matches can render. Unmapped pages never borrow a
 * default city's inventory, and unsupported provider "auto" widgets are not
 * emitted. Change AFFILIATE_DENSITY_MODE to low, balanced, or aggressive.
 */

import { findCityData, convertCityToUrlFriendly, extractCityFromTags } from './citiesData';
import { siteConfig } from './siteConfig';

const DOMAIN_NAME = siteConfig.affiliate.domainName;
const VIATOR_PARTNER_ID = siteConfig.affiliate.viatorPartnerId;
const GETYOURGUIDE_PARTNER_ID = siteConfig.affiliate.getyourguidePartnerId;
const VIATOR_WIDGET_REF = siteConfig.affiliate.viatorWidgetRef;

type AffiliateDensityMode = 'low' | 'balanced' | 'aggressive';
type AffiliatePlacement = 'primary' | 'secondary' | 'tertiary' | 'end';

type DensityRule = {
  placement: AffiliatePlacement;
  minimumSectionCount: number;
  targetSection?: number;
  targetRatio?: number;
};

const DENSITY_PROFILES: Record<AffiliateDensityMode, DensityRule[]> = {
  low: [
    { placement: 'primary', minimumSectionCount: 2, targetSection: 1 },
    { placement: 'secondary', minimumSectionCount: 6, targetRatio: 0.67 },
  ],
  balanced: [
    { placement: 'primary', minimumSectionCount: 2, targetSection: 1 },
    { placement: 'secondary', minimumSectionCount: 3, targetSection: 3 },
    { placement: 'tertiary', minimumSectionCount: 7, targetRatio: 0.75 },
  ],
  aggressive: [
    { placement: 'primary', minimumSectionCount: 2, targetSection: 1 },
    { placement: 'secondary', minimumSectionCount: 2, targetSection: 2 },
    { placement: 'tertiary', minimumSectionCount: 3, targetSection: 3 },
    { placement: 'end', minimumSectionCount: 7, targetRatio: 0.82 },
  ],
};

const GENERIC_COUNTRY_TAGS = new Set([
  'attractions', 'blog', 'city guide', 'europe', 'guide', 'hub page',
  'information', 'itinerary', 'travel', 'travel guide',
]);

function densityMode(): AffiliateDensityMode {
  const configured = String(process.env.AFFILIATE_DENSITY_MODE || 'aggressive').toLowerCase();
  return configured in DENSITY_PROFILES ? configured as AffiliateDensityMode : 'aggressive';
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizePlace(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[-_]/g, ' ')
    .replace(/[^a-z0-9\s()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cityNameMatches(input: string, resolved: string): boolean {
  const expected = normalizePlace(input);
  const normalized = normalizePlace(resolved);
  const main = normalized.split('(')[0].trim();
  const alternate = normalized.includes('(') ? normalized.split('(')[1].split(')')[0].trim() : '';
  return [normalized, main, alternate].filter(Boolean).includes(expected);
}

function buildCampaign(widgetType: string, pageSlug: string): string {
  const site = DOMAIN_NAME.replace(/[^a-zA-Z0-9-]/g, '-').replace(/-+/g, '-').slice(0, 28);
  const slug = String(pageSlug || '')
    .replace(/^\/+|\/+$/g, '')
    .replace(/\.html$/i, '')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return slug ? `${site}-unit-${widgetType}-${slug}` : `${site}-unit-${widgetType}`;
}

function resolveCity(tags: string[]) {
  const cityName = extractCityFromTags(tags);
  if (!cityName) return null;
  const city = findCityData(cityName);
  if (!city || !cityNameMatches(cityName, city.city)) return null;

  const expectedCountry = normalizePlace(String(tags[2] || ''));
  const actualCountry = normalizePlace(String(city.country || ''));
  if (
    expectedCountry
    && actualCountry
    && !GENERIC_COUNTRY_TAGS.has(expectedCountry)
    && expectedCountry !== actualCountry
  ) return null;

  return city;
}

function sponsoredSlot(input: {
  innerHtml: string;
  city: string;
  provider: 'getyourguide' | 'viator';
  widget: string;
  placement: AffiliatePlacement;
  campaign: string;
  locationId?: string;
  minHeight: number;
}): string {
  return `<aside class="affiliate-slot" data-nosnippet
    data-affiliate-unit="experience_finder"
    data-affiliate-provider="${input.provider}"
    data-affiliate-widget="${input.widget}"
    data-affiliate-format="widget"
    data-affiliate-placement="${input.placement}"
    data-affiliate-campaign="${escapeHtml(input.campaign)}"
    data-affiliate-city="${escapeHtml(input.city)}"
    data-affiliate-location-id="${escapeHtml(input.locationId || '')}"
    style="min-height:${input.minHeight}px">
    <span class="affiliate-badge">Sponsored</span>
    <div class="affiliate-skeleton" aria-hidden="true"></div>
    <div class="affiliate-inner">${input.innerHtml}</div>
  </aside>`;
}

function getYourGuideWidget(
  city: ReturnType<typeof findCityData> & {},
  placement: AffiliatePlacement,
  pageSlug: string,
  activities: boolean,
): string {
  if (!city.getyourguideLocationId) return '';
  const widget = activities ? 'activities' : 'city';
  const href = activities
    ? 'https://widget.getyourguide.com/default/activities.frame'
    : 'https://widget.getyourguide.com/default/city.frame';
  const campaign = buildCampaign(activities ? 'gact' : 'gcity', pageSlug);
  const itemCount = activities ? ' data-gyg-number-of-items="4"' : '';
  const innerHtml = `<div
    data-gyg-href="${href}"
    data-gyg-location-id="${escapeHtml(city.getyourguideLocationId)}"
    data-gyg-locale-code="en-US"
    data-gyg-widget="${widget}"
    data-gyg-partner-id="${escapeHtml(GETYOURGUIDE_PARTNER_ID)}"
    data-gyg-campaign="${escapeHtml(campaign)}"
    data-gyg-cmp="${escapeHtml(campaign)}"${itemCount}
    loading="lazy"></div>`;
  return sponsoredSlot({
    innerHtml,
    city: city.city,
    provider: 'getyourguide',
    widget: `getyourguide_${widget}`,
    placement,
    campaign,
    locationId: city.getyourguideLocationId,
    minHeight: activities ? 420 : 400,
  });
}

function viatorWidget(
  city: ReturnType<typeof findCityData> & {},
  placement: AffiliatePlacement,
  pageSlug: string,
): string {
  if (!VIATOR_PARTNER_ID || !VIATOR_WIDGET_REF) return '';
  const campaign = buildCampaign('vauto', pageSlug);
  const innerHtml = `<div
    data-vi-partner-id="${escapeHtml(VIATOR_PARTNER_ID)}"
    data-vi-widget-ref="${escapeHtml(VIATOR_WIDGET_REF)}"
    data-vi-search-term="${escapeHtml(convertCityToUrlFriendly(city.city))}"
    data-vi-campaign="${escapeHtml(campaign)}"
    data-campaign="${escapeHtml(campaign)}"></div>`;
  return sponsoredSlot({
    innerHtml,
    city: city.city,
    provider: 'viator',
    widget: 'viator_widget',
    placement,
    campaign,
    minHeight: 600,
  });
}

function renderPlacement(
  city: ReturnType<typeof findCityData> & {},
  placement: AffiliatePlacement,
  pageSlug: string,
): string {
  if (placement === 'primary') {
    return getYourGuideWidget(city, placement, pageSlug, false)
      || viatorWidget(city, placement, pageSlug);
  }
  if (placement === 'tertiary') {
    return getYourGuideWidget(city, placement, pageSlug, true)
      || viatorWidget(city, placement, pageSlug);
  }
  return viatorWidget(city, placement, pageSlug)
    || getYourGuideWidget(city, placement, pageSlug, true);
}

function removeExistingWidgets(html: string): string {
  html = html.replace(/<aside[^>]*class="[^"]*\baffiliate-slot\b[^"]*"[^>]*>[\s\S]*?<\/aside>/gi, '');
  html = html.replace(/<aside[^>]*class="[^"]*\baffiliate-unit\b[^"]*"[^>]*>[\s\S]*?<\/aside>/gi, '');
  html = html.replace(/<div[^>]*class="affiliate-slot"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi, '');
  html = html.replace(/<div[^>]*data-aff-block="(?:viator-banner|viator-sidebar|viator-link)"[^>]*>[\s\S]*?<\/div>(?:\s*<\/div>)?/gi, '');
  html = html.replace(/<div[^>]*data-gyg-widget[^>]*>[\s\S]*?<\/div>/gi, '');
  html = html.replace(/<div[^>]*data-gyg-partner-id[^>]*>[\s\S]*?<\/div>/gi, '');
  html = html.replace(/<script[^>]*widget\.getyourguide\.com[^>]*>[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<div[^>]*data-id="viator-banner"[^>]*>[\s\S]*?<\/div>/gi, '');
  html = html.replace(/<div[^>]*data-vi-partner-id[^>]*>[\s\S]*?<\/div>/gi, '');
  html = html.replace(/<script[^>]*(?:viator\.com|partners\.vtrcdn\.com)[^>]*>[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<div[^>]*class="sidebar-banner-container"[^>]*>[\s\S]*?<\/div>/gi, '');
  html = html.replace(/<div[^>]*id="sidebar-banner"[^>]*>[\s\S]*?<\/div>/gi, '');
  html = html.replace(/<blockquote><p><strong>(?:Tip|Pro Tip|Recommendation|Insider Tip):<\/strong>[\s\S]*?viator\.com[\s\S]*?<\/p><\/blockquote>/gi, '');
  return html;
}

function faqStart(html: string): number | null {
  const starts: number[] = [];
  const section = html.match(/<section[^>]*class="[^"]*\barticle-faq\b[^"]*"[^>]*>/i);
  if (section?.index !== undefined) starts.push(section.index);
  for (const heading of html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)) {
    const text = heading[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (/^(?:faqs?|frequently asked questions)(?:\b|:)/i.test(text) && heading.index !== undefined) {
      starts.push(heading.index);
    }
  }
  return starts.length > 0 ? Math.min(...starts) : null;
}

function selectPlacements(html: string): Array<{ position: number; placement: AffiliatePlacement }> {
  const faq = faqStart(html);
  const h2Matches = [...html.matchAll(/<h2[^>]*>[\s\S]*?<\/h2>/gi)]
    .filter((match) => {
      const position = match.index ?? -1;
      return faq === null || position < faq;
    });
  if (h2Matches.length === 0) return [];

  const articleClose = html.lastIndexOf('</article>');
  const contentEnd = faq ?? (articleClose >= 0 ? articleClose : html.length);
  if (h2Matches.length === 1) return [{ position: contentEnd, placement: 'end' }];

  const boundaries = h2Matches.map((match, index) => ({
    section: index + 1,
    position: h2Matches[index + 1]?.index ?? contentEnd,
  }));
  const selected: Array<{ position: number; placement: AffiliatePlacement }> = [];
  const usedPositions = new Set<number>();

  for (const rule of DENSITY_PROFILES[densityMode()]) {
    if (h2Matches.length < rule.minimumSectionCount) continue;
    const preferred = rule.targetSection
      ?? Math.max(1, Math.round(h2Matches.length * (rule.targetRatio ?? 0.5)));
    const boundary = boundaries
      .filter((candidate) => !usedPositions.has(candidate.position))
      .sort((a, b) => Math.abs(a.section - preferred) - Math.abs(b.section - preferred))[0];
    if (!boundary) continue;
    usedPositions.add(boundary.position);
    selected.push({ position: boundary.position, placement: rule.placement });
  }
  return selected;
}

export function insertAffiliateLinks(
  htmlContent: string,
  tags: string[] = [],
  pageSlug: string = '',
): string {
  const processedHtml = removeExistingWidgets(htmlContent);
  const lowerCaseTags = tags.map((tag) => String(tag).toLowerCase());
  if (lowerCaseTags.includes('hub page') || lowerCaseTags.includes('country hub')) return processedHtml;

  const city = resolveCity(tags);
  if (!city) return processedHtml;

  const insertions = selectPlacements(processedHtml)
    .map(({ position, placement }) => ({
      position,
      html: renderPlacement(city, placement, pageSlug),
    }))
    .filter((insertion) => insertion.html)
    .sort((a, b) => b.position - a.position);

  let result = processedHtml;
  for (const insertion of insertions) {
    result = `${result.slice(0, insertion.position)}\n${insertion.html}\n${result.slice(insertion.position)}`;
  }
  return result;
}

function isAffiliateEnabled(): boolean {
  const enabled = process.env.AFFILIATE_ENABLED;
  if (enabled === undefined || enabled === null || enabled === '') return true;
  return !['false', '0', 'no'].includes(enabled.toLowerCase().trim());
}

export function processAffiliateLinks(
  content: string,
  tags: string[] = [],
  pageSlugOrOptions: string | { includeSidebarBanner?: boolean } = '',
): string {
  if (!isAffiliateEnabled()) return removeExistingWidgets(content);
  const pageSlug = typeof pageSlugOrOptions === 'string' ? pageSlugOrOptions : '';
  try {
    return insertAffiliateLinks(content, tags, pageSlug);
  } catch (error) {
    console.error('Affiliate widget processing failed:', error);
    return removeExistingWidgets(content);
  }
}

// Compatibility for older layouts that still import a separate sidebar unit.
// Density is now controlled in-article, so rendering another sidebar widget
// would exceed the selected profile.
export function getSidebarBannerHtml(_tags: string[] = []): string | null {
  return null;
}
