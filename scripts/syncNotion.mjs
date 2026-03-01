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

// Ensure folders exist (remove the blog/portfolio mkdirSync calls if you don’t want empty dirs)
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
    f.type === "external" ? f.external?.url :
    f.type === "file" ? f.file?.url :
    "";

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

async function fetchPageMarkdownContent(pageId) {
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
      const rt = (r?.rich_text ?? []).map((x) => x.plain_text).join("");

      if (t === "paragraph") lines.push(rt);
      else if (t === "heading_1") lines.push(`# ${rt}`);
      else if (t === "heading_2") lines.push(`## ${rt}`);
      else if (t === "heading_3") lines.push(`### ${rt}`);
      else if (t === "bulleted_list_item") lines.push(`- ${rt}`);
      else if (t === "numbered_list_item") lines.push(`1. ${rt}`);
      else if (t === "quote") lines.push(`> ${rt}`);
      else if (t === "code") {
        const lang = r.language || "";
        lines.push(`\`\`\`${lang}\n${rt}\n\`\`\``);
      } else if (t === "divider") lines.push(`---`);
      else if (t === "image") {
        const url =
          b.image.type === "external" ? b.image.external.url : b.image.file.url;
        lines.push(`![](${url})`);
      }

      lines.push("");
    }

    if (!res.has_more) break;
    cursor = res.next_cursor;
  }

  return lines.join("\n").trim() + "\n";
}

// ---- NEW: unchanged detection helpers ----
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

function getNotionLastEditedAt(page) {
  // Notion API uses last_edited_time
  return page?.last_edited_time || null;
}
// -----------------------------------------

function mapNotionToFrontMatter(page) {
  const props = page.properties;

  const title = pickTitle(props) || "Untitled";
  const meta_title = pickRichText(getProp(props, "meta_title"));
  const description = pickRichText(getProp(props, "description"));
  const slugProp = pickRichText(getProp(props, "slug"));
  const slug = slugProp || safeSlugFromTitle(title);

  const date = pickDate(getProp(props, "date")) || new Date().toISOString();

  const categories = pickMultiSelect(getProp(props, "categories"));
  const tags = pickMultiSelect(getProp(props, "tags"));

  const author = pickAuthor(getProp(props, "author"));

  const mainImageFile = pickNotionFile(getProp(props, "main_image"));

  const isPublished = pickCheckbox(getProp(props, "is_published"));
  const draft = !isPublished;

  const type = pickSelectName(getProp(props, "type")).toLowerCase();
  const length = pickSelectName(getProp(props, "length"));

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
    type,
    length,

    notion_id: notionPageUrlToId(page),

    // NEW: store Notion edit timestamp
    last_edited_at,

    // existing behavior
    last_synced: new Date().toISOString(),

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

async function main() {
  const existingIndex = buildExistingIndexByNotionId(CONTENT_DIR);

  const pages = await fetchPublishedPages();
  console.log(`Notion: found ${pages.length} published page(s).`);

  for (const page of pages) {
    const pageId = page.id;
    const notionLastEditedAt = getNotionLastEditedAt(page);
    const notionEditedMs = notionLastEditedAt ? parseIsoToMs(notionLastEditedAt) : NaN;

    const existing = existingIndex.get(pageId);

    // NEW: Skip if last_synced >= last_edited_at
    if (existing?.data?.last_synced && Number.isFinite(notionEditedMs)) {
      const lastSyncedMs = parseIsoToMs(existing.data.last_synced);

      if (Number.isFinite(lastSyncedMs) && lastSyncedMs >= notionEditedMs) {
        console.log(
          `Skipped (unchanged): ${pageId} | last_synced=${existing.data.last_synced} >= last_edited_at=${notionLastEditedAt}`
        );
        continue;
      }
    }

    const fm = mapNotionToFrontMatter(page);

    // Download main_image (if present) to /assets/images/gallery/...
    if (fm._mainImageFile?.url) {
      const { publicPath } = await downloadToAssetsGallery(fm._mainImageFile, fm.slug);
      fm.image = publicPath;
    } else {
      fm.image = "";
    }

    delete fm._mainImageFile;

    const md = await fetchPageMarkdownContent(page.id);

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