import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { Client } from "@notionhq/client";
import matter from "gray-matter";
import slugify from "slugify";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!DATABASE_ID || !process.env.NOTION_TOKEN) {
  console.error("Missing NOTION_TOKEN or NOTION_DATABASE_ID in env.");
  process.exit(1);
}

const CONTENT_DIR = path.join(process.cwd(), "content");
const DEFAULT_DIR = path.join(CONTENT_DIR, "blog");
const BLOG_DIR = path.join(CONTENT_DIR, "blog");
const PORTFOLIO_DIR = path.join(CONTENT_DIR, "portfolio");

// Where you want images stored:
const ASSETS_GALLERY_DIR = path.join(process.cwd(), "assets", "images", "gallery");

// Ensure folders exist
fs.mkdirSync(DEFAULT_DIR, { recursive: true });
fs.mkdirSync(BLOG_DIR, { recursive: true });
fs.mkdirSync(PORTFOLIO_DIR, { recursive: true });
fs.mkdirSync(ASSETS_GALLERY_DIR, { recursive: true });

function pickRichText(prop) {
  if (!prop) return "";
  if (prop.type === "rich_text")
    return prop.rich_text?.map((t) => t.plain_text).join("") ?? "";
  if (prop.type === "title")
    return prop.title?.map((t) => t.plain_text).join("") ?? "";
  return "";
}

function pickAuthor(prop) {
  if (!prop) return "";
  if (prop.type === "people") return prop.people?.[0]?.name ?? "";
  return "";
}

function pickSelectName(prop) {
  if (!prop) return "";
  if (prop.type === "select") return prop.select?.name ?? "";
  if (prop.type === "status") return prop.status?.name ?? "";
  if (prop.type === "rich_text")
    return prop.rich_text?.map((t) => t.plain_text).join("") ?? "";
  return "";
}

function pickDate(prop) {
  const d = prop?.date?.start;
  return d ? d : null;
}

function pickMultiSelect(prop) {
  return prop?.multi_select?.map((x) => x.name) ?? [];
}

function pickCheckbox(prop) {
  return !!prop?.checkbox;
}

function getProp(properties, name) {
  return properties?.[name];
}

function getPropNormalized(properties, targetName) {
  if (!properties) return undefined;
  const normalize = (s) => String(s).toLowerCase().replace(/[\s_]+/g, "");
  const target = normalize(targetName);
  for (const [key, value] of Object.entries(properties)) {
    if (normalize(key) === target) return value;
  }
  return undefined;
}

function safeSlugFromTitle(title) {
  return slugify(title, { lower: true, strict: true, trim: true });
}

function pickTitle(properties) {
  const entry = Object.entries(properties || {}).find(([, v]) => v?.type === "title");
  if (!entry) return "";
  const [, prop] = entry;
  return prop.title?.map((t) => t.plain_text).join("") ?? "";
}

function notionPageUrlToId(page) {
  return page.id;
}

function pickNotionFile(prop) {
  if (!prop || prop.type !== "files") return null;
  const f = prop.files?.[0];
  if (!f) return null;

  const url =
    f.type === "external"
      ? f.external?.url
      : f.type === "file"
        ? f.file?.url
        : "";

  const name = f.name || "";
  if (!url) return null;

  return { url, name };
}

function sanitizeFilename(name) {
  const ext = path.extname(name);
  const base = ext ? name.slice(0, -ext.length) : name;
  const safeBase = slugify(base || "image", { lower: true, strict: true, trim: true });
  const safeExt = ext || "";
  return `${safeBase}${safeExt}`;
}

function extFromUrl(url) {
  const clean = url.split("?")[0];
  const ext = path.extname(clean);
  return ext || "";
}

async function downloadToAssetsGallery({ url, name }, fallbackSlug) {
  let filename = name ? sanitizeFilename(name) : "";
  if (!filename) {
    const ext = extFromUrl(url) || ".jpg";
    filename = `${fallbackSlug}${ext}`;
  } else if (!path.extname(filename)) {
    filename = `${filename}${extFromUrl(url) || ".jpg"}`;
  }

  const absPath = path.join(ASSETS_GALLERY_DIR, filename);

  // Skip download if exists
  if (!fs.existsSync(absPath)) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to download image (${res.status}): ${url}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(absPath, buf);
  }

  return {
    publicPath: `/images/gallery/${filename}`,
    savedAs: absPath,
  };
}

async function getPrimaryDataSourceId(databaseId) {
  const db = await notion.databases.retrieve({ database_id: databaseId });
  const ds = db?.data_sources?.[0];
  if (!ds?.id) {
    throw new Error(
      "No data_sources found on this database. Ensure you have access and the database is a supported type."
    );
  }
  return ds.id;
}

async function fetchPublishedPages() {
  const dataSourceId = await getPrimaryDataSourceId(DATABASE_ID);

  const pages = [];
  let cursor = undefined;

  while (true) {
    const res = await notion.dataSources.query({
      data_source_id: dataSourceId,
      start_cursor: cursor,
      filter: { and: [{ property: "is_published", checkbox: { equals: true } }] },
    });

    pages.push(...res.results);
    if (!res.has_more) break;
    cursor = res.next_cursor;
  }

  return pages;
}

// ---- unchanged detection helpers ----
function parseIsoToMs(v) {
  const ms = Date.parse(v);
  return Number.isFinite(ms) ? ms : NaN;
}

function listMarkdownFilesRec(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...listMarkdownFilesRec(full));
    else if (e.isFile() && (full.endsWith(".md") || full.endsWith(".mdx"))) out.push(full);
  }
  return out;
}

function buildExistingIndexByNotionId(rootDir) {
  const index = new Map(); // notion_id -> { filepath, data }
  const files = listMarkdownFilesRec(rootDir);

  for (const fp of files) {
    try {
      const raw = fs.readFileSync(fp, "utf8");
      const parsed = matter(raw);
      const nid = parsed?.data?.notion_id;
      if (typeof nid === "string" && nid) {
        index.set(nid, { filepath: fp, data: parsed.data });
      }
    } catch {
      // ignore unreadable/invalid front matter files
    }
  }

  return index;
}

function getNotionCreatedAt(page) {
  return page?.created_time || null;
}

function getNotionLastEditedAt(page) {
  return page?.last_edited_time || null;
}

// ---- Link + Math support ----
function escapeMdText(s) {
  // Escape [ ] so markdown link text stays sane, and escape $ so currency doesn't become math.
  return (s ?? "")
    .replaceAll("[", "\\[")
    .replaceAll("]", "\\]")
    .replaceAll("$", "\\$");
}

function applyAnnotations(md, ann) {
  if (!ann) return md;
  let out = md;
  if (ann.code) out = "`" + out.replaceAll("`", "\\`") + "`";
  if (ann.bold) out = `**${out}**`;
  if (ann.italic) out = `*${out}*`;
  if (ann.strikethrough) out = `~~${out}~~`;
  if (ann.underline) out = `<u>${out}</u>`;
  return out;
}

// Marker link that Hugo render hook will rewrite using relref.
function hugoRefMarker(contentPath) {
  return `hugo-ref:${contentPath}`;
}

function contentRelPath(absFile) {
  return path.relative(CONTENT_DIR, absFile).replaceAll(path.sep, "/");
}

function plannedRelPathFromFrontMatter(fm) {
  const rawDate = fm.date ? new Date(fm.date) : new Date();
  const yyyy = rawDate.getFullYear();
  const mm = String(rawDate.getMonth() + 1).padStart(2, "0");
  const dd = String(rawDate.getDate()).padStart(2, "0");
  const datePrefix = `${yyyy}-${mm}-${dd}`;
  const filename = `${datePrefix}-${fm.slug}.md`;

  const dir = fm.type === "project" ? "portfolio" : "blog";
  return `${dir}/${filename}`;
}

function normalizeNotionId(id) {
  if (!id) return null;
  const raw = String(id).replaceAll("-", "").toLowerCase();
  if (!/^[0-9a-f]{32}$/.test(raw)) return null;
  return `${raw.slice(0, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}-${raw.slice(16, 20)}-${raw.slice(20)}`;
}

function extractNotionPageIdFromUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (!u.hostname.includes("notion.so")) return null;

    const m =
      u.pathname.match(/([0-9a-fA-F]{32})/) || u.pathname.match(/([0-9a-fA-F-]{36})/);
    if (!m) return null;

    return normalizeNotionId(m[1]);
  } catch {
    return null;
  }
}

function renderRichText(richTextArr, notionIdToContentPath) {
  return (richTextArr ?? [])
    .map((rt) => {
      const ann = rt.annotations;

      // Inline equations -> $...$ (do NOT apply code annotation)
      if (rt.type === "equation") {
        const expr = rt.equation?.expression ?? "";
        const annNoCode = ann ? { ...ann, code: false } : ann;
        return applyAnnotations(`$${expr}$`, annNoCode);
      }

      // Page mentions -> internal hugo-ref marker
      if (rt.type === "mention" && rt.mention?.type === "page") {
        const targetId = normalizeNotionId(rt.mention.page.id);
        const text = escapeMdText(rt.plain_text || "link");
        const targetPath = targetId ? notionIdToContentPath.get(targetId) : null;

        if (targetPath) {
          return applyAnnotations(`[${text}](${hugoRefMarker(targetPath)})`, ann);
        }
        return applyAnnotations(text, ann);
      }

      // Text with optional href (rewrite Notion URLs to internal hugo-ref marker)
      if (rt.type === "text") {
        const text = escapeMdText(rt.plain_text || "");
        const href = rt.href || rt.text?.link?.url;

        if (!href) return applyAnnotations(text, ann);

        const maybeId = extractNotionPageIdFromUrl(href);
        if (maybeId) {
          const targetPath = notionIdToContentPath.get(maybeId);
          if (targetPath) {
            return applyAnnotations(`[${text}](${hugoRefMarker(targetPath)})`, ann);
          }
        }

        return applyAnnotations(`[${text}](${href})`, ann);
      }

      // Fallback
      return applyAnnotations(escapeMdText(rt.plain_text || ""), ann);
    })
    .join("");
}

function mapNotionToFrontMatter(page) {
  const props = page.properties;

  const pageType = (pickSelectName(getProp(props, "type")) || "").toLowerCase();

  const rawTitle = pickTitle(props) || "Untitled";
  let title = rawTitle;

  if (pageType === "blog" && !rawTitle.startsWith("📝 ")) {
    title = `📝 ${rawTitle}`;
  } else if (pageType === "project" && !rawTitle.startsWith("💼 ")) {
    title = `💼 ${rawTitle}`;
  }

  const meta_title = pickRichText(getPropNormalized(props, "meta_title"));
  const description = pickRichText(getProp(props, "description"));
  const slugProp = pickRichText(getProp(props, "slug"));

  // optional: slugify from rawTitle to avoid emojis affecting slug
  const slug = slugProp || safeSlugFromTitle(rawTitle);

  const date = pickDate(getProp(props, "date")) || new Date().toISOString();

  const categories = pickMultiSelect(getProp(props, "categories"));
  const tags = pickMultiSelect(getProp(props, "tags"));
  const author = pickAuthor(getProp(props, "author"));

  const mainImageFile = pickNotionFile(getProp(props, "main_image"));

  const isPublished = pickCheckbox(getProp(props, "is_published"));
  const draft = !isPublished;

  const length = pickSelectName(getProp(props, "length"));

  const created_at = getNotionCreatedAt(page) || new Date().toISOString();
  const last_edited_at = getNotionLastEditedAt(page) || new Date().toISOString();

  return {
    title,
    meta_title,
    description,
    slug,
    date,
    categories,
    author,
    tags,

    image: "",

    draft,
    type: pageType,
    length,

    notion_id: notionPageUrlToId(page),

    created_at,
    last_edited_at,
    last_synced: new Date().toISOString(),

    math: true,

    _mainImageFile: mainImageFile,
  };
}

function dirForType(type) {
  if (type === "blog") return BLOG_DIR;
  if (type === "project") return PORTFOLIO_DIR;
  return DEFAULT_DIR;
}

function writePostFile(slug, frontMatterObj, contentMd, preferredPath = null) {
  let filepath = preferredPath;

  if (!filepath) {
    const rawDate = frontMatterObj.date ? new Date(frontMatterObj.date) : new Date();
    const yyyy = rawDate.getFullYear();
    const mm = String(rawDate.getMonth() + 1).padStart(2, "0");
    const dd = String(rawDate.getDate()).padStart(2, "0");
    const datePrefix = `${yyyy}-${mm}-${dd}`;

    const filename = `${datePrefix}-${slug}.md`;
    const targetDir = dirForType(frontMatterObj.type);
    fs.mkdirSync(targetDir, { recursive: true });
    filepath = path.join(targetDir, filename);
  } else {
    fs.mkdirSync(path.dirname(filepath), { recursive: true });
  }

  const file = matter.stringify(contentMd, frontMatterObj);
  fs.writeFileSync(filepath, file, "utf8");

  return filepath;
}

async function fetchPageMarkdownContent(pageId, notionIdToContentPath) {
  const lines = [];
  let cursor = undefined;

  while (true) {
    const res = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
    });

    for (const b of res.results) {
      const t = b.type;
      const r = b[t];

      const rt = renderRichText(r?.rich_text ?? [], notionIdToContentPath);

      if (t === "paragraph") lines.push(rt);
      else if (t === "heading_1") lines.push(`# ${rt}`);
      else if (t === "heading_2") lines.push(`## ${rt}`);
      else if (t === "heading_3") lines.push(`### ${rt}`);
      else if (t === "bulleted_list_item") lines.push(`- ${rt}`);
      else if (t === "numbered_list_item") lines.push(`1. ${rt}`);
      else if (t === "quote") lines.push(`> ${rt}`);
      else if (t === "code") {
        const lang = r.language || "";
        const codeText = (r?.rich_text ?? []).map((x) => x.plain_text).join("");
        lines.push(`\`\`\`${lang}\n${codeText}\n\`\`\``);
      } else if (t === "divider") lines.push(`---`);
      else if (t === "image") {
        const url =
          b.image.type === "external" ? b.image.external.url : b.image.file.url;
        lines.push(`![](${url})`);
      } else if (t === "equation") {
        const expr = b.equation?.expression ?? "";
        lines.push(`$$\n${expr}\n$$`);
      }

      lines.push("");
    }

    if (!res.has_more) break;
    cursor = res.next_cursor;
  }

  return lines.join("\n").trim() + "\n";
}

async function main() {
  const existingIndexRaw = buildExistingIndexByNotionId(CONTENT_DIR);

  // Normalize keys so URL-extracted IDs match
  const existingIndex = new Map();
  for (const [nid, info] of existingIndexRaw.entries()) {
    const norm = normalizeNotionId(nid);
    if (norm) existingIndex.set(norm, info);
  }

  const pages = await fetchPublishedPages();
  console.log(`Notion: found ${pages.length} published page(s).`);

  // Build notion_id -> content path map
  const notionIdToContentPath = new Map();

  // 1) Prefer existing paths (stable)
  for (const [nid, info] of existingIndex.entries()) {
    notionIdToContentPath.set(nid, contentRelPath(info.filepath));
  }

  // 2) Add planned paths for pages that aren't on disk yet
  for (const page of pages) {
    const nid = normalizeNotionId(page.id);
    if (!nid) continue;
    if (notionIdToContentPath.has(nid)) continue;

    const fmPlan = mapNotionToFrontMatter(page);
    notionIdToContentPath.set(nid, plannedRelPathFromFrontMatter(fmPlan));
  }

  for (const page of pages) {
    const pageId = normalizeNotionId(page.id);
    const notionLastEditedAt = getNotionLastEditedAt(page);
    const notionEditedMs = notionLastEditedAt ? parseIsoToMs(notionLastEditedAt) : NaN;

    const existing = pageId ? existingIndex.get(pageId) : undefined;

    // Skip if last_synced >= last_edited_at
    if (existing?.data?.last_synced && Number.isFinite(notionEditedMs)) {
      const lastSyncedMs = parseIsoToMs(existing.data.last_synced);
      if (Number.isFinite(lastSyncedMs) && lastSyncedMs >= notionEditedMs) {
        console.log(
          `Skipped (unchanged): ${page.id} | last_synced=${existing.data.last_synced} >= last_edited_at=${notionLastEditedAt}`
        );
        continue;
      }
    }

    const fm = mapNotionToFrontMatter(page);

    // Download main_image (if present)
    if (fm._mainImageFile?.url) {
      const { publicPath } = await downloadToAssetsGallery(fm._mainImageFile, fm.slug);
      fm.image = publicPath;
    } else {
      fm.image = "";
    }
    delete fm._mainImageFile;

    const md = await fetchPageMarkdownContent(page.id, notionIdToContentPath);

    // Prefer overwriting the existing file if we found it by notion_id
    const preferredPath = existing?.filepath ?? null;

    const outPath = writePostFile(fm.slug, fm, md, preferredPath);
    console.log(
      `Synced: ${fm.slug} (${fm.type || "blog"}) -> ${path.relative(process.cwd(), outPath)}`
    );
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});