# CLAUDE.md

Personal site for Jack Shipsmith: blog, portfolio of data/ML work, predictions, and a services page. Content is authored in Notion, synced into Hugo, and deployed to GitHub Pages.

## Stack

- Hugo (hugoplate boilerplate base)
- Tailwind CSS v4 (`@tailwindcss/cli`) + maintained custom CSS
- Notion → markdown via sync script
- GitHub Actions → GitHub Pages

## Commands

- Dev: `npm run dev` (syncs Notion, then `hugo server`)
- Build: `npm run build`
- Sync content: `npm run sync:notion`
- Format: `npm run format`
- Hugo only: `hugo server`

Requires `.env`: `NOTION_TOKEN`, `NOTION_DATABASE_ID`

## How I work here

- Make minimal, reviewable changes; modify only what the request needs.
- Match existing style and conventions; reuse partials before creating new ones.
- Don't refactor or clean up unrelated code; don't add dependencies or new files unless clearly needed.
- Don't scan the whole repo; read only the files the task needs.
- If unclear or there are multiple sensible interpretations, ask — don't guess. Flag simpler approaches when they exist.
- After edits: list changed files with the reason for each.

## Content system (Notion-sourced)

- Source: Notion → `scripts/syncNotion.mjs`
- Output: `content/{blog,portfolio,predictions,...}/`
- Front matter includes `notion_id`, `last_synced`

Rules:

- Do NOT rename/remove front-matter fields.
- Do NOT modify the sync script unless explicitly asked.
- Treat generated markdown as machine-output: make minimal edits, preserve structure and links.

## Paths

- Root config: `hugo.toml`
- Other config: `config/_default/` (`menus.en.toml`, `module.toml`, `params.toml`)
- Content: `content/`
- Layouts: `layouts/` — base in `_default/`; per-section dirs `blog/`, `portfolio/`, `predictions/`, `services/`, `network/`, `about/`, `contact/`, `authors/`, `postcard/`, `date/`
- Partials: `layouts/partials/` (`components/`, `widgets/`, `essentials/`)
- Shortcodes: `layouts/shortcodes/`
- Assets: `assets/` (CSS in `assets/css/`, JS in `assets/js/main.js`)
- Static: `static/`
- Workflows: `.github/workflows/`

## Routing

`/`, `/blog/`, `/portfolio/`, `/predictions/`, `/services/`, `/about/`, `/contact/`, `/network/`

## Styling

- Entry: `assets/css/main.css`; theme-driven Tailwind v4.
- Custom CSS is a maintained layer: `assets/css/{buttons,components,custom}.css`.
- Prefer Tailwind utilities for one-off styling; use the custom CSS files for shared/component styles utilities can't express cleanly. Don't introduce a new styling system.

## JavaScript

- Minimal JS in `assets/js/main.js`. Prefer Hugo/templates/CSS over adding JS.

## Output format

1. Brief plan
2. Minimal implementation
3. Files changed (with reasons)
4. Risks / follow-up

Keep responses concise; summarize rather than dumping large files or logs.
