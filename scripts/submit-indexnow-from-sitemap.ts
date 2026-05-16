import fs from "fs";
import path from "path";

type Args = {
  sitemapPath: string;
  endpoint: string;
  key?: string;
  keyLocation?: string;
  host?: string;
  dryRun: boolean;
  chunkSize: number;
};

function parseArgs(argv: string[]): Args {
  const sitemapPathDefault = path.join(process.cwd(), "public", "sitemap.xml");

  const args: Args = {
    sitemapPath: sitemapPathDefault,
    endpoint: process.env.INDEXNOW_ENDPOINT ?? "https://api.indexnow.org/indexnow",
    key: process.env.INDEXNOW_KEY,
    keyLocation: process.env.INDEXNOW_KEY_LOCATION,
    host: process.env.INDEXNOW_HOST,
    dryRun: false,
    chunkSize: Number(process.env.INDEXNOW_CHUNK_SIZE ?? "10000"),
  };

  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (token === "--sitemap") args.sitemapPath = argv[++i] ?? args.sitemapPath;
    else if (token === "--endpoint") args.endpoint = argv[++i] ?? args.endpoint;
    else if (token === "--key") args.key = argv[++i] ?? args.key;
    else if (token === "--key-location") args.keyLocation = argv[++i] ?? args.keyLocation;
    else if (token === "--host") args.host = argv[++i] ?? args.host;
    else if (token === "--chunk-size") args.chunkSize = Number(argv[++i] ?? args.chunkSize);
    else if (token === "--dry-run") args.dryRun = true;
    else if (token === "--help" || token === "-h") {
      printHelpAndExit(0);
    }
  }

  if (!Number.isFinite(args.chunkSize) || args.chunkSize <= 0) {
    throw new Error(`Invalid --chunk-size: ${args.chunkSize}`);
  }

  return args;
}

function printHelpAndExit(code: number): never {
  // eslint-disable-next-line no-console
  console.log(`
Submit URLs from public/sitemap.xml to IndexNow.

Usage:
  npx tsx scripts/submit-indexnow-from-sitemap.ts --dry-run
  INDEXNOW_KEY=... npx tsx scripts/submit-indexnow-from-sitemap.ts

Options:
  --sitemap <path>        Path to sitemap.xml (default: public/sitemap.xml)
  --endpoint <url>        IndexNow endpoint (default: https://api.indexnow.org/indexnow)
  --key <key>             IndexNow key (prefer INDEXNOW_KEY env var)
  --key-location <url>    Public URL to the key file (default: https://<host>/<key>.txt)
  --host <host>           Hostname override (default: inferred from sitemap URLs)
  --chunk-size <n>        URLs per request (default: 10000)
  --dry-run               Print request payload(s) and exit

Env vars:
  INDEXNOW_KEY, INDEXNOW_ENDPOINT, INDEXNOW_HOST, INDEXNOW_KEY_LOCATION, INDEXNOW_CHUNK_SIZE
`.trim());
  process.exit(code);
}

function decodeXmlEntities(input: string): string {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function readUrlsFromSitemapXml(sitemapXml: string): string[] {
  const urls: string[] = [];
  const locRegex = /<loc>\s*([^<]+?)\s*<\/loc>/g;
  for (const match of sitemapXml.matchAll(locRegex)) {
    const loc = decodeXmlEntities(match[1].trim());
    if (loc) urls.push(loc);
  }
  return urls;
}

function inferHostFromUrls(urls: string[]): string {
  const hosts = new Set<string>();
  for (const u of urls) {
    try {
      hosts.add(new URL(u).host);
    } catch {
      // ignore invalid URLs; IndexNow expects absolute URLs anyway
    }
  }

  if (hosts.size === 0) {
    throw new Error("Could not infer host from sitemap URLs (no valid absolute URLs found).");
  }
  if (hosts.size > 1) {
    throw new Error(`Sitemap contains multiple hosts: ${Array.from(hosts).join(", ")}`);
  }
  return Array.from(hosts)[0];
}

function chunk<T>(items: T[], chunkSize: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += chunkSize) out.push(items.slice(i, i + chunkSize));
  return out;
}

async function submitIndexNowBatch(params: {
  endpoint: string;
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}): Promise<{ status: number; responseText: string }> {
  const response = await fetch(params.endpoint, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: params.host,
      key: params.key,
      keyLocation: params.keyLocation,
      urlList: params.urlList,
    }),
  });

  const responseText = await response.text().catch(() => "");
  return { status: response.status, responseText };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!fs.existsSync(args.sitemapPath)) {
    throw new Error(`Sitemap not found: ${args.sitemapPath}`);
  }

  const sitemapXml = fs.readFileSync(args.sitemapPath, "utf8");
  const urls = readUrlsFromSitemapXml(sitemapXml);
  if (urls.length === 0) throw new Error(`No <loc> entries found in ${args.sitemapPath}`);

  const host = args.host ?? inferHostFromUrls(urls);
  const key = args.key;
  if (!key) throw new Error("Missing IndexNow key. Set INDEXNOW_KEY or pass --key.");

  const keyLocation = args.keyLocation ?? `https://${host}/${key}.txt`;

  const urlBatches = chunk(urls, Math.min(args.chunkSize, 10000));

  // eslint-disable-next-line no-console
  console.log(
    `IndexNow: ${urls.length} URL(s) from ${path.relative(process.cwd(), args.sitemapPath)} -> ${urlBatches.length} request(s)`
  );

  if (args.dryRun) {
    for (const [i, urlList] of urlBatches.entries()) {
      // eslint-disable-next-line no-console
      console.log(JSON.stringify({ endpoint: args.endpoint, host, keyLocation, urlCount: urlList.length }, null, 2));
      if (i === 0) {
        // eslint-disable-next-line no-console
        console.log(JSON.stringify({ sampleUrls: urlList.slice(0, 5) }, null, 2));
      }
    }
    return;
  }

  for (const [i, urlList] of urlBatches.entries()) {
    // eslint-disable-next-line no-console
    console.log(`Submitting batch ${i + 1}/${urlBatches.length} (${urlList.length} URLs) to ${args.endpoint}`);

    const { status, responseText } = await submitIndexNowBatch({
      endpoint: args.endpoint,
      host,
      key,
      keyLocation,
      urlList,
    });

    if (status < 200 || status >= 300) {
      throw new Error(
        `IndexNow submission failed (HTTP ${status}). Response: ${responseText ? responseText.slice(0, 2000) : "<empty>"}`
      );
    }
  }

  // eslint-disable-next-line no-console
  console.log("IndexNow submission complete.");
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});

