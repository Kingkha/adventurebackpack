/**
 * Pre-launch placeholder detection.
 *
 * Runs before every build. Fails fast if the clone still contains template
 * placeholders that would harm SEO and credibility on a new domain:
 *   - "Japan Activity" brand strings
 *   - "Kai Nakamura" default author
 *   - japanactivity.com baseUrl / email
 *   - @japanactivity social handles
 *   - hardcoded "50,000+" testimonial stat
 *   - editorSameAs pointing at japanactivity social URLs
 *   - Orphaned static public/robots.txt (should be deleted — served dynamically
 *     via app/robots.ts)
 *
 * The template repo itself will always fail these checks. Set
 * SKIP_LAUNCH_VALIDATION=1 to bypass on the template source-of-truth repo. New
 * clones should remove that env var before their first deploy.
 */

import fs from "fs"
import path from "path"
import dotenv from "dotenv"

// Load .env.local before reading siteConfig so the template source-of-truth
// can set SKIP_LAUNCH_VALIDATION=1 there. Next.js loads .env.local in-process,
// but tsx (used by prebuild) does not — hence the manual load here.
// Order matches Next.js convention: .env.local overrides .env.
for (const envFile of [".env.local", ".env"]) {
  const envPath = path.join(process.cwd(), envFile)
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: false })
  }
}

import { siteConfig } from "../lib/siteConfig"

type Finding = { severity: "error" | "warn"; message: string }

function run(): Finding[] {
  const findings: Finding[] = []
  const root = process.cwd()

  // 1. Brand name
  if (/japan\s*activity/i.test(siteConfig.brand.name)) {
    findings.push({
      severity: "error",
      message: `siteConfig.brand.name still contains template placeholder: "${siteConfig.brand.name}"`,
    })
  }

  // 2. Default author
  if (/kai\s*nakamura/i.test(siteConfig.author.defaultName)) {
    findings.push({
      severity: "error",
      message: `siteConfig.author.defaultName is still the template default: "${siteConfig.author.defaultName}"`,
    })
  }

  // 3. Base URL
  if (/japanactivity\.com/i.test(siteConfig.domain.baseUrl)) {
    findings.push({
      severity: "error",
      message: `siteConfig.domain.baseUrl still points to japanactivity.com: "${siteConfig.domain.baseUrl}"`,
    })
  }

  // 4. Contact email
  if (/japanactivity\.com/i.test(siteConfig.contact.email)) {
    findings.push({
      severity: "error",
      message: `siteConfig.contact.email still uses japanactivity.com: "${siteConfig.contact.email}"`,
    })
  }

  // 4b. Affiliate campaign tracking label — used as data-campaign on Viator
  // banners, so leaving it as "japanactivity" pollutes affiliate reporting.
  if (/japanactivity/i.test(siteConfig.affiliate.domainName)) {
    findings.push({
      severity: "error",
      message: `siteConfig.affiliate.domainName still uses "japanactivity" as its campaign label — update to your new project name for clean affiliate attribution.`,
    })
  }

  // 5. Social handles
  for (const [platform, handle] of Object.entries(siteConfig.social)) {
    if (handle && /japanactivity/i.test(handle)) {
      findings.push({
        severity: "error",
        message: `siteConfig.social.${platform} still points to @japanactivity: "${handle}"`,
      })
    }
  }

  // 6. Editor sameAs URLs
  const badSameAs = siteConfig.authorPage.editorSameAs.filter((url) =>
    /japanactivity/i.test(url)
  )
  if (badSameAs.length > 0) {
    findings.push({
      severity: "error",
      message: `siteConfig.authorPage.editorSameAs contains japanactivity URLs: ${badSameAs.join(", ")}`,
    })
  }

  // 7. Hardcoded 50,000+ testimonial stat (should be undefined unless user provides real number)
  const stats = (siteConfig.testimonials as { stats?: { number?: string } }).stats
  if (stats && typeof stats.number === "string" && /50,?000/i.test(stats.number)) {
    findings.push({
      severity: "error",
      message: `siteConfig.testimonials.stats still has the fake "50,000+" template number. Replace with a real, verifiable figure or set stats to undefined.`,
    })
  }

  // 8. Static robots.txt should not exist (handled by app/robots.ts)
  if (fs.existsSync(path.join(root, "public", "robots.txt"))) {
    findings.push({
      severity: "error",
      message: `public/robots.txt exists — delete it. robots.txt is now served dynamically from app/robots.ts.`,
    })
  }

  // 9. app/robots.ts must exist
  if (!fs.existsSync(path.join(root, "app", "robots.ts"))) {
    findings.push({
      severity: "error",
      message: `app/robots.ts is missing — dynamic robots.txt route is required.`,
    })
  }

  // 10. Grep for leftover "Japan Activity" / "Kai Nakamura" in siteConfig.ts
  //     (catches cases where only brand.name was swapped but other fields still leak)
  try {
    const raw = fs.readFileSync(path.join(root, "lib", "siteConfig.ts"), "utf8")
    const japanMatches = raw.match(/Japan\s*Activity/gi)
    if (japanMatches && japanMatches.length > 0) {
      findings.push({
        severity: "error",
        message: `lib/siteConfig.ts still contains ${japanMatches.length} "Japan Activity" reference(s). Run a full find-replace before shipping.`,
      })
    }
    if (/Kai\s*Nakamura/i.test(raw)) {
      findings.push({
        severity: "error",
        message: `lib/siteConfig.ts still contains "Kai Nakamura" references.`,
      })
    }
  } catch {
    // siteConfig.ts should exist — if not, generate-blog-cache will fail louder
  }

  return findings
}

function main() {
  if (process.env.SKIP_LAUNCH_VALIDATION === "1") {
    console.log("validate-launch: SKIPPED (SKIP_LAUNCH_VALIDATION=1)")
    return
  }

  const findings = run()
  const errors = findings.filter((f) => f.severity === "error")
  const warnings = findings.filter((f) => f.severity === "warn")

  if (warnings.length > 0) {
    console.warn("\nvalidate-launch warnings:")
    for (const w of warnings) console.warn(`  ⚠  ${w.message}`)
  }

  if (errors.length > 0) {
    console.error("\nvalidate-launch FAILED — placeholder template content detected:")
    for (const e of errors) console.error(`  ✗ ${e.message}`)
    console.error(
      "\nIf this is the template source-of-truth repo, set SKIP_LAUNCH_VALIDATION=1 to bypass."
    )
    console.error(
      "Otherwise, finish rebranding before building — shipping with placeholder content on a new domain harms SEO and trust.\n"
    )
    process.exit(1)
  }

  console.log("validate-launch: passed")
}

main()
