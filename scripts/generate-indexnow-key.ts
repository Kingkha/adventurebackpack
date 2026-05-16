import crypto from "crypto";
import fs from "fs";
import path from "path";

type Args = {
  key?: string;
  bytes: number;
  publicDir: string;
  force: boolean;
};

function printHelpAndExit(code: number): never {
  // eslint-disable-next-line no-console
  console.log(`
Generate an IndexNow key and write public/<key>.txt (contents == key).

Usage:
  npx tsx scripts/generate-indexnow-key.ts
  npx tsx scripts/generate-indexnow-key.ts --key <key>

Options:
  --key <key>         Use an existing key instead of generating one
  --bytes <n>         Random bytes to generate (default: 32 => 64 hex chars)
  --public-dir <dir>  Public dir (default: public)
  --force             Overwrite if the file already exists
  -h, --help          Show help
`.trim());
  process.exit(code);
}

function parseArgs(argv: string[]): Args {
  const args: Args = {
    bytes: Number(process.env.INDEXNOW_KEY_BYTES ?? "32"),
    publicDir: path.join(process.cwd(), "public"),
    force: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (token === "--key") args.key = argv[++i] ?? args.key;
    else if (token === "--bytes") args.bytes = Number(argv[++i] ?? args.bytes);
    else if (token === "--public-dir") args.publicDir = argv[++i] ?? args.publicDir;
    else if (token === "--force") args.force = true;
    else if (token === "--help" || token === "-h") printHelpAndExit(0);
  }

  if (!Number.isFinite(args.bytes) || args.bytes <= 0) throw new Error(`Invalid --bytes: ${args.bytes}`);
  return args;
}

function isValidKeyFilename(key: string): boolean {
  return /^[A-Za-z0-9_-]+$/.test(key);
}

export function writeIndexNowKeyFile(params: {
  key: string;
  publicDir: string;
  force?: boolean;
}): { key: string; filePath: string } {
  if (!isValidKeyFilename(params.key)) {
    throw new Error("Invalid key. Use only letters, numbers, underscore, or dash.");
  }

  fs.mkdirSync(params.publicDir, { recursive: true });
  const filePath = path.join(params.publicDir, `${params.key}.txt`);

  if (fs.existsSync(filePath) && !params.force) {
    return { key: params.key, filePath };
  }

  fs.writeFileSync(filePath, `${params.key}\n`, "utf8");
  return { key: params.key, filePath };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const key = args.key ?? crypto.randomBytes(args.bytes).toString("hex");
  const { filePath } = writeIndexNowKeyFile({ key, publicDir: args.publicDir, force: args.force });

  // eslint-disable-next-line no-console
  console.log(`IndexNow key: ${key}`);
  // eslint-disable-next-line no-console
  console.log(`Wrote: ${path.relative(process.cwd(), filePath)}`);
  // eslint-disable-next-line no-console
  console.log(`Next: ensure https://<host>/${key}.txt returns the key, then run: INDEXNOW_KEY=${key} npm run indexnow`);
}

main();

