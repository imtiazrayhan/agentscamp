/**
 * Pings IndexNow (Bing, Yandex, Seznam, Naver + the shared IndexNow network) so
 * search engines re-crawl after content changes.
 *
 * By default it submits only the URLs that CHANGED in this deploy: it git-diffs
 * the deploy commit against a base, maps changed content files to their URLs
 * (cross-checked against the live URL set), and adds the listing pages + home
 * page they affect. If the diff can't be computed (no base, shallow clone, not
 * a repo) it safely falls back to submitting every URL.
 *
 * Diff base resolution order:
 *   1. INDEXNOW_DIFF_BASE (explicit override)
 *   2. VERCEL_GIT_PREVIOUS_SHA  (last successful deploy on this branch; only set
 *      when an "Ignored Build Step" is configured — used if it resolves)
 *   3. HEAD~1                   (reliable: Vercel shallow-clones with depth 10)
 *
 * Wired as `postbuild`, so it runs after every build — but it only actually
 * submits on a Vercel PRODUCTION build (VERCEL_ENV=production) or with --force.
 * Preview and local builds are no-ops, and a failed ping never fails the build.
 *
 *   npm run indexnow                  # changed URLs, respects the prod guard
 *   npm run indexnow -- --all         # submit every URL (ignore the diff)
 *   npm run indexnow -- --force       # submit regardless of environment
 *   npm run indexnow -- --dry-run     # print what would be submitted, no POST
 *
 * The key is read from public/<key>.txt (the file IndexNow fetches to verify
 * ownership), or from the INDEXNOW_KEY env var if set.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { getAllContent, contentTypeList } from "../src/lib/content/index";
import { site } from "../src/lib/site";

const ENDPOINT = "https://api.indexnow.org/indexnow";
const CONTENT_PREFIX = "src/content/";
// Direct source→route edits we can resolve precisely (component-level changes
// that ripple across many pages are not tracked here — use --all for those).
const STATIC_FILE_ROUTES: Record<string, string> = {
  "src/app/page.tsx": "",
  "src/app/how-to-use/page.tsx": "/how-to-use",
};

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const force = args.has("--force");
const submitAll = args.has("--all");

/** Resolve the IndexNow key from env, else from the public/<key>.txt file. */
function resolveKey(): string {
  if (process.env.INDEXNOW_KEY) return process.env.INDEXNOW_KEY.trim();

  const publicDir = path.join(process.cwd(), "public");
  const candidates = fs
    .readdirSync(publicDir)
    .filter((f) => /^[a-zA-Z0-9-]{8,128}\.txt$/.test(f));

  for (const file of candidates) {
    const key = file.replace(/\.txt$/, "");
    // IndexNow requires the file's contents to equal the key (its filename).
    const contents = fs.readFileSync(path.join(publicDir, file), "utf8").trim();
    if (contents === key) return key;
  }

  throw new Error(
    "No IndexNow key found. Set INDEXNOW_KEY, or add public/<key>.txt whose contents equal <key>.",
  );
}

/** Every live path, mirroring src/app/sitemap.ts so the two never drift. */
function allLivePaths(): string[] {
  const staticPaths = [
    "",
    "/how-to-use",
    "/feed.xml",
    ...contentTypeList.map((d) => d.basePath),
  ];
  const contentPaths = getAllContent().map((i) => i.href);
  return [...staticPaths, ...contentPaths];
}

function gitRefExists(ref: string): boolean {
  try {
    execFileSync("git", ["rev-parse", "--verify", "--quiet", `${ref}^{commit}`], {
      stdio: ["ignore", "ignore", "ignore"],
    });
    return true;
  } catch {
    return false;
  }
}

function resolveDiffBase(): string | null {
  const candidates = [
    process.env.INDEXNOW_DIFF_BASE?.trim(),
    process.env.VERCEL_GIT_PREVIOUS_SHA?.trim(),
    "HEAD~1",
  ];
  for (const ref of candidates) {
    if (ref && gitRefExists(ref)) return ref;
  }
  return null;
}

/** Content/static files added, copied, modified, renamed or type-changed. */
function changedFiles(base: string): string[] {
  const out = execFileSync(
    "git",
    ["diff", "--name-only", "--diff-filter=ACMRT", base, "HEAD"],
    { encoding: "utf8" },
  ).trim();
  return out ? out.split("\n").filter(Boolean) : [];
}

/** Map changed files to the paths that should be re-submitted. */
function changedPaths(files: string[], live: Set<string>): Set<string> {
  const out = new Set<string>();
  const affectedListings = new Set<string>();
  let contentChanged = false;

  for (const file of files) {
    if (file.startsWith(CONTENT_PREFIX)) {
      const rel = file.slice(CONTENT_PREFIX.length).replace(/\.md$/, "");
      const urlPath = `/${rel}`;
      if (live.has(urlPath)) {
        out.add(urlPath);
        contentChanged = true;
        affectedListings.add(`/${rel.split("/")[0]}`); // e.g. /agents
      }
    } else if (file in STATIC_FILE_ROUTES) {
      out.add(STATIC_FILE_ROUTES[file]);
    }
  }

  // The home page (featured/recent) and the type listings render the changed
  // items, so refresh those too.
  if (contentChanged) {
    out.add("");
    for (const listing of affectedListings) {
      if (live.has(listing)) out.add(listing);
    }
  }

  return out;
}

async function main() {
  const { origin, host } = new URL(site.url);
  const live = allLivePaths();
  const liveSet = new Set(live);
  const key = resolveKey();
  const keyLocation = `${origin}/${key}.txt`;

  // Decide which paths to submit.
  let paths: string[];
  let mode: string;
  const base = submitAll ? null : resolveDiffBase();

  if (submitAll || base === null) {
    paths = live;
    mode = submitAll ? "all (--all)" : "all (no diff base — falling back)";
  } else {
    try {
      paths = [...changedPaths(changedFiles(base), liveSet)];
      mode = `changed since ${base}`;
    } catch {
      paths = live;
      mode = "all (git diff failed — falling back)";
    }
  }

  const urls = paths.map((p) => `${origin}${p}`);
  console.log(`[indexnow] host=${host} mode=${mode} urls=${urls.length}`);

  if (dryRun) {
    console.log("[indexnow] --dry-run, not submitting.");
    for (const url of urls) console.log(`  ${url || origin}`);
    return;
  }

  if (urls.length === 0) {
    console.log("[indexnow] no changed URLs to submit.");
    return;
  }

  if (!force && process.env.VERCEL_ENV !== "production") {
    console.log(
      `[indexnow] skipping submit (VERCEL_ENV=${process.env.VERCEL_ENV ?? "unset"}; pass --force to override).`,
    );
    return;
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key, keyLocation, urlList: urls }),
  });

  if (res.ok || res.status === 202) {
    console.log(`[indexnow] submitted ${urls.length} URLs (HTTP ${res.status}).`);
  } else {
    const text = await res.text().catch(() => "");
    console.warn(`[indexnow] submission returned HTTP ${res.status}. ${text}`.trim());
  }
}

main().catch((err: unknown) => {
  // A search-engine ping must never break the build/deploy.
  const message = err instanceof Error ? err.message : String(err);
  console.warn(`[indexnow] non-fatal error: ${message}`);
});
