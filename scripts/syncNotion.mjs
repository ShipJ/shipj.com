/**
 * Notion -> Hugo content sync
 * 1. Pulls published pages from a Notion DB
 * 2. Writes/updates Markdown files under /content/{blog, portfolio}
 * 3. Downloads a main_image file into /assets/images/gallery
 * 4. Rewrites Notion page links to an internal hugo-ref marker for Hugo render hooks
 * 5. Ensures math / latex blocks can be visualised correctly
 *
 * Notes:
 * - Keeps paths stable by indexing markdown via `notion_id`
 * - Skips unchanged pages when `last_synced >= last_edited_time`
 */

import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { Client } from "@notionhq/client";
import matter from "gray-matter";
import slugify from "slugify";

const env = (k) => process.env[k];
const die = (m) => (console.error(m), process.exit(1));
const notion = new Client({ auth: env("NOTION_TOKEN") });

const DATABASE_ID = env("NOTION_DATABASE_ID");
if (!env("NOTION_TOKEN") || !DATABASE_ID) die("Missing NOTION_TOKEN or NOTION_DATABASE_ID in env.");

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");
const DIRS = {
  blog: path.join(CONTENT_DIR, "blog"),
  portfolio: path.join(CONTENT_DIR, "portfolio"),
  default: path.join(CONTENT_DIR, "blog"),
  gallery: path.join(ROOT, "assets", "images", "gallery"),
};

// Ensure required directories exist
Object.values(DIRS).forEach((d) => fs.mkdirSync(d, { recursive: true }));

/* ------------------------------ small helpers ----------------------------- */

const normalizeKey = (s) => String(s).toLowerCase().replace(/[\s_]+/g, "");
const slug = (s) => slugify(s || "", { lower: true, strict: true, trim: true }) || "untitled";
const isoMs = (v) => {
  const ms = Date.parse(v);
  return Number.isFinite(ms) ? ms : NaN;
};
const relToContent = (abs) => path.relative(CONTENT_DIR, abs).replaceAll(path.sep, "/");

// Normalize Notion id to canonical 36-char uuid format, or null
const normalizeNotionId = (id) => {
  if (!id) return null;
  const raw = String(id).replaceAll("-", "").toLowerCase();
  if (!/^[0-9a-f]{32}$/.test(raw)) return null;
  return `${raw.slice(0, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}-${raw.slice(16, 20)}-${raw.slice(20)}`;
};

// Extract notion page id from a notion.so URL (or null)
const notionIdFromUrl = (url) => {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (!u.hostname.includes("notion.so")) return null;
    const m = u.pathname.match(/([0-9a-fA-F]{32})/) || u.pathname.match(/([0-9a-fA-F-]{36})/);
    return m ? normalizeNotionId(m[1]) : null;
  } catch {
    return null;
  }
};

// Minimal escaping so markdown labels don’t break and $ doesn’t become math
const escMd = (s) =>
  (s ?? "").replaceAll("[", "\\[").replaceAll("]", "\\]").replaceAll("$", "\\$");

// Apply Notion inline annotations to plain markdown text (NOT to the whole link wrapper)
const applyAnn = (txt, ann = {}) => {
  let out = txt;
  if (ann.code) out = "`" + out.replaceAll("`", "\\`") + "`";
  if (ann.bold) out = `**${out}**`;
  if (ann.italic) out = `*${out}*`;
  if (ann.strikethrough) out = `~~${out}~~`;
  if (ann.underline) out = `<u>${out}</u>`; // HTML underline (Goldmark won't parse markdown inside)
  return out;
};

// Hugo render hook marker (your hook should rewrite hugo-ref:... into relref)
const hugoRef = (contentPath) => `hugo-ref:${contentPath}`;

/* ------------------------------ Notion props ----------------------------- */

// Find the first Notion "title" property and return its plain string
const pickTitle = (props) =>
  Object.values(props || {}).find((p) => p?.type === "title")?.title?.map((t) => t.plain_text).join("") ||
  "";

// Generic property getter that tolerates minor name differences: "meta_title" vs "Meta Title"
const prop = (props, name) => {
  const target = normalizeKey(name);
  return Object.entries(props || {}).find(([k]) => normalizeKey(k) === target)?.[1];
};

const pickText = (p) =>
  !p
    ? ""
    : p.type === "rich_text"
      ? p.rich_text?.map((t) => t.plain_text).join("") ?? ""
      : p.type === "title"
        ? p.title?.map((t) => t.plain_text).join("") ?? ""
        : "";

const pickSelect = (p) =>
  !p
    ? ""
    : p.type === "select"
      ? p.select?.name ?? ""
      : p.type === "status"
        ? p.status?.name ?? ""
        : p.type === "rich_text"
          ? pickText(p)
          : "";

const pickScalar = (p) =>
  !p
    ? ""
    : p.type === "number"
      ? p.number ?? ""
      : p.type === "formula"
        ? p.formula?.type === "string"
          ? p.formula.string ?? ""
          : p.formula?.type === "number"
            ? p.formula.number ?? ""
            : p.formula?.type === "boolean"
              ? p.formula.boolean ?? ""
              : ""
        : pickText(p) || pickSelect(p);

const pickPeople = (p) => (p?.type === "people" ? p.people?.[0]?.name ?? "" : "");
const pickDate = (p) => p?.date?.start ?? null;
const pickMulti = (p) => p?.multi_select?.map((x) => x.name) ?? [];
const pickCheck = (p) => !!p?.checkbox;

// Pull first file from a Notion `files` property (supports both external + file)
const pickFile = (p) => {
  if (!p || p.type !== "files") return null;
  const f = p.files?.[0];
  const url = f?.type === "external" ? f.external?.url : f?.type === "file" ? f.file?.url : "";
  return url ? { url, name: f?.name || "" } : null;
};

/* -------------------------- file + image handling ------------------------- */

const extFromUrl = (url) => path.extname(url.split("?")[0]) || "";
const safeFilename = (name) => {
  const ext = path.extname(name);
  const base = ext ? name.slice(0, -ext.length) : name;
  return `${slug(base || "image")}${ext || ""}`;
};

// Download to /assets/images/gallery, skipping if already present
async function downloadGallery(file, fallbackSlug) {
  let filename = file.name ? safeFilename(file.name) : "";
  if (!filename) filename = `${fallbackSlug}${extFromUrl(file.url) || ".jpg"}`;
  if (!path.extname(filename)) filename += extFromUrl(file.url) || ".jpg";

  const abs = path.join(DIRS.gallery, filename);
  if (!fs.existsSync(abs)) {
    const res = await fetch(file.url);
    if (!res.ok) throw new Error(`Failed to download image (${res.status}): ${file.url}`);
    fs.writeFileSync(abs, Buffer.from(await res.arrayBuffer()));
  }
  return { publicPath: `/images/gallery/${filename}`, abs };
}

/* -------------------------- existing content index ------------------------- */

// Recursively list .md/.mdx files under a folder
const listMd = (dir) => {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...listMd(full));
    else if (e.isFile() && (full.endsWith(".md") || full.endsWith(".mdx"))) out.push(full);
  }
  return out;
};

// Build notion_id -> { filepath, data } from markdown front matter
function buildIndex(rootDir) {
  const idx = new Map();
  for (const fp of listMd(rootDir)) {
    try {
      const parsed = matter(fs.readFileSync(fp, "utf8"));
      const nid = normalizeNotionId(parsed?.data?.notion_id);
      if (nid) idx.set(nid, { filepath: fp, data: parsed.data });
    } catch {
      /* ignore invalid files */
    }
  }
  return idx;
}

/* ---------------------------- Notion -> Markdown --------------------------- */

/**
 * IMPORTANT: Goldmark won't parse markdown inside HTML wrappers and shouldn't wrap links in `<u>` or backticks.
 * So: apply formatting to the label only, then wrap with `[label](href)`.
 */
function renderRichText(richText = [], idToContentPath) {
  const isBareUrl = (s) => /^https?:\/\/\S+$/i.test(s || "");

  const mdLink = (labelPlain, href, ann) => {
    // Keep outer link pure; disable underline+code for the link wrapper.
    const annLabel = ann ? { ...ann, code: false } : ann;
    let label = applyAnn(escMd(labelPlain), { ...annLabel, underline: false });
    if (ann?.underline) label = `<u>${label}</u>`; // underline safely *inside* label
    return `[${label}](${href})`;
  };

  return richText
    .map((rt) => {
      const ann = rt.annotations || {};

      // Inline equation rich text
      if (rt.type === "equation") return applyAnn(`$${rt.equation?.expression ?? ""}$`, { ...ann, code: false });

      // Mentioned page => internal hugo-ref (preferred) else external notion URL
      if (rt.type === "mention" && rt.mention?.type === "page") {
        const targetId = normalizeNotionId(rt.mention.page.id);
        const label = rt.plain_text || "link";
        const targetPath = targetId ? idToContentPath.get(targetId) : null;
        return targetPath
          ? mdLink(label, hugoRef(targetPath), ann)
          : mdLink(label, `https://www.notion.so/${String(rt.mention.page.id).replaceAll("-", "")}`, ann);
      }

      // Normal text, optionally linked
      if (rt.type === "text") {
        const raw = rt.plain_text || "";
        const href = rt.href || rt.text?.link?.url;

        // Autolink bare URLs when Notion didn’t provide href
        if (!href) return isBareUrl(raw) ? applyAnn(`<${raw}>`, { ...ann, code: false, underline: false }) : applyAnn(escMd(raw), ann);

        // Rewrite notion URL => hugo-ref marker when we know target content path
        const maybeId = notionIdFromUrl(href);
        const targetPath = maybeId ? idToContentPath.get(maybeId) : null;
        return mdLink(raw, targetPath ? hugoRef(targetPath) : href, ann);
      }

      // Fallback
      return applyAnn(escMd(rt.plain_text || ""), ann);
    })
    .join("");
}

// Notion block -> markdown line(s)
function blockToMarkdown(b, idToContentPath) {
  const t = b.type;
  const r = b[t];
  const rt = renderRichText(r?.rich_text ?? [], idToContentPath);

  switch (t) {
    case "paragraph":
      return [rt, ""];
    case "heading_1":
      return [`# ${rt}`, ""];
    case "heading_2":
      return [`## ${rt}`, ""];
    case "heading_3":
      return [`### ${rt}`, ""];
    case "bulleted_list_item":
      return [`- ${rt}`, ""];
    case "numbered_list_item":
      return [`1. ${rt}`, ""];
    case "quote":
      return [`> ${rt}`, ""];
    case "divider":
      return ["---", ""];
    case "code": {
      const lang = r.language || "";
      const codeText = (r?.rich_text ?? []).map((x) => x.plain_text).join("");
      return [`\`\`\`${lang}\n${codeText}\n\`\`\``, ""];
    }
    case "image": {
      const url = b.image.type === "external" ? b.image.external.url : b.image.file.url;
      return [`![](${url})`, ""];
    }
    case "equation":
      return [`$$\n${b.equation?.expression ?? ""}\n$$`, ""];
    default:
      return ["", ""]; // ignore unsupported blocks
  }
}

/* ------------------------------ front matter ------------------------------ */

function mapFrontMatter(page) {
  const props = page.properties || {};
  const pageType = (pickSelect(prop(props, "type")) || "").toLowerCase();
  const rawTitle = pickTitle(props) || "Untitled";
  const readTimeProp = prop(props, "read_time");

  const slugProp = pickText(prop(props, "slug"));
  const fm = {
    title: rawTitle,
    meta_title: pickText(prop(props, "meta_title")),
    description: pickText(prop(props, "description")),
    slug: slugProp || slug(rawTitle), // slug from rawTitle (avoids emoji noise)
    date: pickDate(prop(props, "date")) || new Date().toISOString(),
    categories: pickMulti(prop(props, "categories")),
    tags: pickMulti(prop(props, "tags")),
    author: pickPeople(prop(props, "author")),
    length: pickSelect(prop(props, "length")),
    read_time: pickScalar(readTimeProp),
    type: pageType,
    draft: !pickCheck(prop(props, "is_published")),
    notion_id: page.id, // store original; we normalize on read
    created_at: page.created_time || new Date().toISOString(),
    last_edited_at: page.last_edited_time || new Date().toISOString(),
    last_synced: new Date().toISOString(),
    math: true,
    image: "",
    _mainImageFile: pickFile(prop(props, "main_image")), // internal temp field
  };

  return fm;
}

const dirForType = (t) => (t === "portfolio" ? DIRS.portfolio : t === "blog" ? DIRS.blog : DIRS.default);

// Planned relative path for new pages (so internal links can be rewritten before files exist)
function plannedRelPath(fm) {
  const d = fm.date ? new Date(fm.date) : new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${fm.type}/${yyyy}-${mm}-${dd}-${fm.slug}.md`;
}

// Write markdown file (prefer overwriting existing path when known)
function writeMd(fm, body, preferredAbs = null) {
  const d = fm.date ? new Date(fm.date) : new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");

  const targetAbs =
    preferredAbs ||
    path.join(dirForType(fm.type), `${yyyy}-${mm}-${dd}-${fm.slug}.md`);

  fs.mkdirSync(path.dirname(targetAbs), { recursive: true });
  fs.writeFileSync(targetAbs, matter.stringify(body, fm), "utf8");
  return targetAbs;
}

/* ------------------------------ Notion fetch ------------------------------ */

// Notion API v2: query uses data_sources, so we must retrieve the database, then data_source_id
async function getPrimaryDataSourceId(databaseId) {
  const db = await notion.databases.retrieve({ database_id: databaseId });
  const ds = db?.data_sources?.[0];
  if (!ds?.id) throw new Error("No data_sources found on this database.");
  return ds.id;
}

async function fetchPublishedPages() {
  const data_source_id = await getPrimaryDataSourceId(DATABASE_ID);
  const pages = [];
  let start_cursor;

  // Paginate until done
  while (true) {
    const res = await notion.dataSources.query({
      data_source_id,
      start_cursor,
      filter: { and: [{ property: "is_published", checkbox: { equals: true } }] },
    });
    pages.push(...res.results);
    if (!res.has_more) break;
    start_cursor = res.next_cursor;
  }

  return pages;
}

async function fetchPageMarkdown(pageId, idToContentPath) {
  const lines = [];
  let start_cursor;

  while (true) {
    const res = await notion.blocks.children.list({ block_id: pageId, start_cursor });
    for (const b of res.results) lines.push(...blockToMarkdown(b, idToContentPath));
    if (!res.has_more) break;
    start_cursor = res.next_cursor;
  }

  return lines.join("\n").trim() + "\n";
}

/* ---------------------------------- main --------------------------------- */

async function main() {
  const existing = buildIndex(CONTENT_DIR); // notion_id(norm) -> { filepath, data }
  const pages = await fetchPublishedPages();
  console.log(`Notion: found ${pages.length} published page(s).`);

  // Map notion_id(norm) -> content relative path for link rewriting
  const idToContentPath = new Map([...existing.entries()].map(([id, info]) => [id, relToContent(info.filepath)]));

  // Add planned paths for pages not yet on disk (so internal links still resolve)
  for (const p of pages) {
    const id = normalizeNotionId(p.id);
    if (!id || idToContentPath.has(id)) continue;
    idToContentPath.set(id, plannedRelPath(mapFrontMatter(p)));
  }

  for (const p of pages) {
    const id = normalizeNotionId(p.id);
    const old = id ? existing.get(id) : null;

    // Skip unchanged: last_synced >= notion last_edited_time
    const editedMs = isoMs(p.last_edited_time);
    const syncedMs = isoMs(old?.data?.last_synced);
    if (Number.isFinite(editedMs) && Number.isFinite(syncedMs) && syncedMs >= editedMs) {
      console.log(`Skipped (unchanged): ${p.id}`);
      continue;
    }

    // Front matter from properties
    const fm = mapFrontMatter(p);

    // Download main image (optional)
    if (fm._mainImageFile?.url) fm.image = (await downloadGallery(fm._mainImageFile, fm.slug)).publicPath;
    delete fm._mainImageFile;

    // Body markdown from Notion blocks
    const body = await fetchPageMarkdown(p.id, idToContentPath);

    // Prefer overwriting existing file path for stability
    const outAbs = writeMd(fm, body, old?.filepath || null);
    console.log(`Synced: ${fm.slug} (${fm.type || "blog"}) -> ${path.relative(ROOT, outAbs)}`);
  }

  console.log("Done.");
}

main().catch((err) => die(err?.stack || String(err)));
