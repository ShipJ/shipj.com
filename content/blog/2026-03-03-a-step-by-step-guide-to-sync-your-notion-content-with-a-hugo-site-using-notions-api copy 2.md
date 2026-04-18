---
title: "A step-by-step guide to sync your Notion content with a Hugo site using Notion’s API"
meta_title: >-
  Sync Notion Content with Your Hugo Site Using the Notion API: A Step-by-Step
  Guide
description: >-
  How to sync your notion content - blog posts, projects etc with a personal
  website via the Notion API
slug: >-
  a-step-by-step-guide-to-sync-your-notion-content-with-a-hugo-site-using-notions-api
date: '2026-03-03T11:28:26.082Z'
categories:
  - Data Engineering
tags:
  - Notion
  - Hugo
  - git
  - SEO
  - personal-goals
author: Jack
length: Very Short (1-2 days)
type: blog
draft: false
notion_id: 3187fd6b-fd0d-8055-9e3f-e1f79643cb61
created_at: '2026-03-03T09:11:00.000Z'
last_edited_at: '2026-03-03T11:28:00.000Z'
last_synced: '2026-03-03T11:28:26.083Z'
math: true
image: ''
---
If you write everything in Notion — blog posts, project notes, ideas — and maintain a separate Hugo site, you have probably felt the friction of copying content between the two. This guide eliminates that by turning Notion into the CMS for your Hugo site, with a single sync script that does all the heavy lifting.

**The goal:** write and publish in Notion, run one command, and have your Hugo `content/` folder updated automatically — no copy-pasting, no duplicate files, no manual front matter.

The sync is intentionally one-way (Notion → Hugo), so Notion remains the single source of truth and your Hugo output is always reproducible.

### Before you start

You will get the smoothest experience with this guide if you already have:

- a working Hugo site
- Node.js 18+ installed
- one Notion database that will act as your content source
- 30-45 minutes to get the first version working locally

By the end, you will have a one-command workflow that pulls published Notion pages into Hugo Markdown files.

### High-level flow

```
Publish post in Notion → node scripts/notion-sync.mjs → Markdown in Hugo content/
```

---

### 1) Create a Notion integration and connect your database

1. In Notion, create a new Database (or use an existing one).

2. Navigate to **Settings → Connections → Develop or manage integrations**.

3. Create an [**Integration**](https://www.notion.so/profile/integrations/public) and copy the **Internal Integration Token**.

4. In your Notion database, click **… → Connections → Connect to** your integration.

5. Copy the **Database ID** from the URL (the 32-character string before the `?v=` query parameter).

Store these credentials securely — I use Google Secret Manager for CI, and a local `.env` file for development:

- `NOTION_TOKEN`
- `NOTION_DATABASE_ID`

---

### 2) Add properties to your Notion database

The sync script maps Notion properties to Hugo front matter fields. The exact properties are up to you, but consistency matters — changing a property name later means updating the script too.

> Keep your property names stable once the sync is working. Renaming fields later is one of the easiest ways to introduce silent breakage.

**Required**

- `title` (Title) — the page title, used as the post heading and to generate the slug
- `is_published` (Checkbox) — only pages with this checked will be synced

**Recommended**

- `date` (Date) — maps to the Hugo publish date; defaults to `created_time` if omitted
- `description` (Text) — used for meta descriptions and post previews
- `categories` (Multi-select) — maps to Hugo taxonomy
- `tags` (Multi-select) — maps to Hugo taxonomy
- `author` (People) — maps to the `author` front matter field

**Optional extras**

- `type` (Select: `blog` / `portfolio`) — lets you route content to different Hugo sections (`content/blog/` vs `content/portfolio/`) from a single Notion database
- `main_image` (Files & media) — a cover image; the sync script downloads it locally to avoid Notion’s expiring signed URLs
- `meta_title` (Text) — override the `<title>` tag independently from the post heading, useful for SEO tuning

---

### 3) Install dependencies

Node 18+ is recommended (built-in `fetch`, no node-fetch needed). From your Hugo project root:

```bash
npm init -y
npm install @notionhq/client gray-matter slugify dotenv
```

| Package | Purpose |
|---|---|
| `@notionhq/client` | Official Notion API SDK |
| `gray-matter` | Parse and write front matter |
| `slugify` | Generate consistent URL slugs from titles |
| `dotenv` | Load `.env` credentials locally |

---

### 4) Write the sync script

Create `scripts/notion-sync.mjs`. My implementation is [available here](https://github.com/ShipJ/shipj.com/blob/main/scripts/syncNotion.mjs) as a reference.

At a high level, the script should:

1. **Query Notion** for all pages where `is_published == true`
2. **Skip unchanged pages** — compare `last_edited_time` against the `last_synced` value stored in front matter
3. **Convert blocks to Markdown** — handle headings, paragraphs, bulleted and numbered lists, code blocks, block quotes, dividers, and images
4. **Route output** — write to `content/blog/` or `content/portfolio/` based on the `type` property (or a single directory if you keep it simple)
5. **Build front matter** — map Notion properties to Hugo front matter fields, and always store `notion_id` and `last_synced`
6. **Download images** — save any `main_image` files to `assets/images/gallery/` at sync time; Notion’s file URLs are signed and expire after one hour

> Never hotlink Notion-hosted image URLs. They expire quickly, so if you want reliable published pages, download images locally during sync.

A minimal script structure looks like this:

```js
import { Client } from "@notionhq/client";
import { writeFileSync } from "fs";
import slugify from "slugify";
import dotenv from "dotenv";
dotenv.config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const { results } = await notion.databases.query({
  database_id: process.env.NOTION_DATABASE_ID,
  filter: { property: "is_published", checkbox: { equals: true } },
});

for (const page of results) {
  const blocks = await notion.blocks.children.list({ block_id: page.id });
  const markdown = blocksToMarkdown(blocks.results); // implement this
  const frontMatter = buildFrontMatter(page);         // implement this
  const slug = slugify(page.properties.title.title[0].plain_text, { lower: true });
  const outputPath = `content/blog/${slug}.md`;
  writeFileSync(outputPath, `${frontMatter}\n${markdown}`);
  console.log(`Synced: ${outputPath}`);
}
```

---

### 5) Configure environment variables

Create a `.env` file in your project root:

```bash
NOTION_TOKEN=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Important:** add `.env` to `.gitignore` immediately. Never commit API tokens.

> Do this before your first commit after wiring the sync up. Accidentally pushing a live Notion token is an avoidable but expensive mistake.

```bash
echo ".env" >> .gitignore
```

For CI/CD (e.g. GitHub Actions), set these as [repository secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) and reference them in your workflow.

---

### 6) Run the sync

```bash
node scripts/notion-sync.mjs
```

Expected output:

```
Found 12 published pages
Skipped 10 unchanged pages
Synced: content/blog/2026-03-03-building-with-notion-api.md
Synced: content/portfolio/2026-02-15-side-project.md
```

Resulting files:

- Markdown in `content/blog/` and/or `content/portfolio/`
- Images in `assets/images/gallery/` (if `main_image` is enabled)

At this point, you have a working local sync. Everything below is useful, but optional.

## Optional next steps

---

### 7) (Optional) Preserve internal Notion links

If you link between Notion pages, the sync script can rewrite those links to a custom marker:

```md
[My Other Post](hugo-ref:blog/2026-02-15-my-other-post.md)
```

Then add a Hugo [render hook](https://gohugo.io/templates/render-hooks/) at `layouts/_default/_markup/render-link.html` to convert this marker into a `relref` call:

```html
{{- if hasPrefix .Destination "hugo-ref:" -}}
  {{- $path := strings.TrimPrefix "hugo-ref:" .Destination -}}
  <a href="{{ relref .Page $path }}">{{ .Text }}</a>
{{- else -}}
  <a href="{{ .Destination }}"{{ with .Title }} title="{{ . }}"{{ end }}>{{ .Text }}</a>
{{- end -}}
```

This ensures internal links resolve correctly regardless of the final URL structure.

---

### 8) Integrate into your workflow

**Local development** — run sync before building:

```bash
node scripts/notion-sync.mjs && hugo server
```

**Before committing:**

```bash
node scripts/notion-sync.mjs && git add content/ && git commit -m "sync: notion content"
```

**Automated via GitHub Actions** — add a scheduled workflow to sync and deploy daily:

```yaml
name: Sync and Deploy

on:
  schedule:
    - cron: "0 6 * * *"   # daily at 06:00 UTC
  workflow_dispatch:        # allow manual trigger

jobs:
  sync-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20" }
      - run: npm ci
      - run: node scripts/notion-sync.mjs
        env:
          NOTION_TOKEN: ${{ secrets.NOTION_TOKEN }}
          NOTION_DATABASE_ID: ${{ secrets.NOTION_DATABASE_ID }}
      - uses: peaceiris/actions-hugo@v3
      - run: hugo --minify
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

---

### Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| No pages returned | Database not connected to integration, or `is_published` unchecked | Share the database with your integration via **… → Connections** |
| `401` / `403` errors | Wrong token, or token lacks access to the database | Regenerate the token and re-connect the database |
| Images missing or broken | Notion file URLs expire after ~1 hour | Always download images during sync; never hotlink Notion URLs |
| Duplicate files on re-sync | Slug changed between runs | Store `notion_id` in front matter and use it as the file identifier, not the slug |
| Blocks missing from output | Unsupported block types (e.g. callouts, toggles) | Add handlers in `blocksToMarkdown` for any block types you use |

> If you expect titles to change over time, treat `notion_id` as the durable identity and the slug as presentation only. That one decision prevents a lot of duplicate-file cleanup later.
