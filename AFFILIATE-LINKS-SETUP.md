# Affiliate Links Auto-Insertion System

✅ **INSTALLED AND READY TO USE**

## What Was Added

### 1. Files Copied from Festivation
- ✅ `content/cities.csv` - Database of 1,182 cities with Viator & GetYourGuide IDs
- ✅ `lib/citiesData.ts` - CSV loader with memory caching
- ✅ `lib/affiliateLinks.ts` - Affiliate widget generator (configured for tourismattractions)
- ✅ `app/globals.css` - Sidebar banner CSS styles

### 2. Integration
- ✅ `app/blog/[slug]/page.tsx` - Automatically processes affiliate links for all blog posts

## Configuration

### Partner IDs (`lib/affiliateLinks.ts`)
```typescript
const DOMAIN_NAME = 'tourismattractions';
const VIATOR_PARTNER_ID = 'P00271059';
const GETYOURGUIDE_PARTNER_ID = '26CH4CT';
const VIATOR_WIDGET_REF = 'W-79bb4726-3e27-495c-8aee-4987b955143e';
```

## How It Works

### Automatic Widget Placement

For every blog post with a city in the 4th tag:

1. **Viator Banner (728x90)** - After lead paragraph or at start
2. **GetYourGuide City Widget** - Before first H2
3. **After Each H2**:
   - H2 #1 → GetYourGuide auto widget
   - H2 #2 → Viator auto widget
   - H2 #3 → GetYourGuide activities widget
   - H2 #4 → Viator CTA link (styled green box)
   - H2 #5+ → Random mix
4. **Sidebar Banner (300x250)** - Fixed right side on desktop

### Tag Structure Required

```yaml
tags:
  - "Travel"      # Tag 1
  - "Europe"      # Tag 2
  - "Spain"       # Tag 3
  - "Barcelona"   # Tag 4 ← CITY NAME (required for affiliate links)
```

## Widget Types

### 1. Viator Banner (728x90)
- Campaign: `tourismattractions-banner`
- Location: After lead paragraph
- Format: Horizontal banner

### 2. GetYourGuide Widgets
- City Widget: Shows popular city activities
- Auto Widget: Contextual based on content
- Activities Widget: Shows 4 specific activities
- Campaign: Uses `26CH4CT` partner ID

### 3. Viator Widgets
- Auto Widget: Contextual tours
- Sidebar Banner: Fixed 300x250
- CTA Links: Styled green boxes
- Campaign: `tourismattractions-link`, `tourismattractions-sidebar`

## Responsive Design

**Desktop (> 1025px):**
- Sidebar visible on right side
- Fixed position, vertically centered
- Stays visible while scrolling

**Mobile (< 1024px):**
- Sidebar shows at end of article
- Full width responsive design
- No fixed positioning

## Performance

- **Cities CSV**: Loaded once at startup, cached in RAM
- **Processing**: ~1-5ms per blog post
- **No API calls**: All server-side processing
- **Zero user-facing delays**: Everything happens during SSR

## Testing

Check console logs for:
```
✅ Processing affiliate links for: Barcelona (Viator: 562, GYG: 45)
  ✓ Added Viator banner after lead paragraph
  ✓ Added GYG city widget before first H2
  ✓ Added widgets after N H2 tags
  ✓ Added sidebar banner (300x250)
```

## Verification

1. **Start dev server**: `npm run dev`
2. **Open any blog post** with a city in 4th tag
3. **Look for**:
   - Viator banner after first paragraph
   - GetYourGuide widgets throughout
   - Styled green CTA boxes
   - Sidebar banner on right (desktop)

## Build & Deploy

```bash
npm run build    # Test build
npm run dev      # Development
npm start        # Production
```

The affiliate system is **fully integrated** and will work automatically for all blog posts with proper tags!

## Campaign Tracking

All widgets use campaign tracking:
- `tourismattractions-banner` - Top Viator banner
- `tourismattractions-link` - Text CTA links
- `tourismattractions-sidebar` - Right sidebar banner
- Partner ID: `P00271059` (Viator)
- Partner ID: `26CH4CT` (GetYourGuide)

## Support

If widgets don't appear:
1. Check blog post has 4+ tags
2. Verify 4th tag is a valid city from `cities.csv`
3. Check console logs for errors
4. Ensure `cities.csv` is in `content/` directory

---

**✅ System is ready to use! No additional configuration needed.**

