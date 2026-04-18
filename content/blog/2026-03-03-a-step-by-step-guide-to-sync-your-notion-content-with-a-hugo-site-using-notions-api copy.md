---
title: >-
  A step-by-step guide to sync your Notion content with a Hugo site using
  Notion’s API
meta_title: >-
  Sync Notion Content with Your Hugo Site Using the Notion API: A Step-by-Step
  Guide
description: >-
  How to sync your notion content - blog posts, projects etc with a personal
  website via the Notion API
slug: >-
  a-step-by-step-guide-to-sync-your-notion-content-with-a-hugo-site-using-notions-api
date: '2026-04-18T09:31:10.975Z'
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
read_time: 5
type: blog
draft: false
notion_id: 3187fd6b-fd0d-8055-9e3f-e1f79643cb61
created_at: '2026-03-03T09:11:00.000Z'
last_edited_at: '2026-04-18T09:30:00.000Z'
last_synced: '2026-04-18T09:31:10.975Z'
math: true
image: ''
---
Have you ever wanted to write everything in Notion, leverage its clean editor, databases, relations, and rich formatting, and publish that directly to your own Hugo site with one script?

**Problem Statement**

Avoid copying and pasting Markdown, managing files, and maintaining two parallel systems, you want Notion to be your CMS - while keeping full control of your static site.

If that’s you goal, this guide walks through a simple, reproducible way to sync your Notion pages directly with your Hugo `content/` folder. The sync is one-way, i.e you can build on top of existing content.

### High-level outcome

Publish post in Notion → Sync → Markdown written to Hugo `content/`

---

### 1) Create Notion integration and connect your database

1. In Notion, create a new Database (or use an existing one)

1. Navigate to Settings > Connections > Develop or manage integrations.

1. Create an [**Integration**](https://www.notion.so/profile/integrations/public)** **and copy the **Internal Integration Token**.

1. In your Notion Database, click **… → Connections → Connect to** your integration.

1. Copy the **Database ID** from the URL.

Store the following credentials securely in a secrets manager (I use google secrets manager).

- `NOTION_TOKEN`

- `NOTION_DATABASE_ID`

---

### 2) Add properties to your Notion database

You can add whatever properties you like but try to be consistent - the following worked for me. I didn’t add a ‘slug’ field here.

**Required**

- `title` (Text)

- `is_published` (Checkbox)

**Recommended**

- `date` (Date): to map to a publish date

- `description` (Text)

- `categories` (Multi-select)

- `tags` (Multi-select)

- `author` (People)

**Extras for fun**

- `type` (Select: `blog` / `portfolio`): I intended to separate one-off blog posts from larger project work. Having a switch like this 

- `main_image` (Files): I thought it might be fun 

- `meta_title` (Text): I played around with the AI feature to auto-populate to maximise SEO

---

### 3) Install Hugo dependencies

Node 18+ is recommended for built-in `fetch`. From your Hugo project root, run:

```plain text
npm init-y
npm i @notionhq/client gray-matter slugify dotenv
```

---

### 4) Create a sync script

Create a file like the following, mine is [here](https://github.com/ShipJ/shipj.com/blob/main/scripts/syncNotion.mjs): 

```plain text
scripts/notion-sync.mjs
```

Your script should:

- Query Notion for pages where `is_published == true`

- Convert Blocks → Markdown (headings, paragraphs, lists, code, quotes, dividers, images)

- Map content to `content/blog/` or `content/portfolio/`

- Add front matter (title, date, tags, etc.)

- Optionally download `main_image` to `assets/images/gallery/` and link in front matter

---

### 5) Add environment variables

Create `.env` in your repo root and paste Notion credentials. Add `.env` to `.gitignore`!

```plain text
NOTION_TOKEN=secret_xxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

### 6) Run the sync

```plain text
node scripts/notion-sync.mjs
```

You should see logs like:

- Found N published pages

- Skipped unchanged pages

- Synced markdown paths

Result:

- Markdown files in `content/blog/` and/or `content/portfolio/`

- Images saved to `assets/images/gallery/` (if enabled)

---

### 7) (Optional) Make internal Notion links work in Hugo

If your script rewrites Notion links into a marker like:

```plain text
[hugo-ref:blog/2026-03-02-my-post.md]
```

Create a Hugo **render hook** for links that converts that marker into `relref`.

This preserves internal links between posts when you publish from Notion.

---

### 8) Add it to your workflow

**Manual:** run before you commit:

```plain text
node scripts/notion-sync.mjs && hugo
```

**Automated (example):**

- GitHub Actions cron job (daily)

- Or trigger on push to your content repo

---

### Troubleshooting

- **No results?** confirm the database is shared with the integration, and `is_published` is checked.

- **401/403:** token wrong or database not connected to the integration.

- **Missing images:** Notion file URLs expire; always download during sync rather than hotlink.

- **Duplicates:** ensure you store `notion_id` in front matter and use it to overwrite the same file on subsequent runs.
