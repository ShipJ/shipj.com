# CLAUDE.md

## Stack
- Hugo
- Tailwind CSS v4
- Notion (synced via script)
- GitHub Actions → GitHub Pages

## Commands
- Dev: npm run dev
- Build: npm run build
- Sync content: npm run sync:notion
- Format: npm run format
- Hugo only: hugo server

Requires `.env`:
- NOTION_TOKEN
- NOTION_DATABASE_ID

## Core rules
- Make minimal, reviewable changes
- Read only files needed for the task
- Do not scan the whole repo unless asked
- Do not add dependencies unless necessary
- Do not create new files unless clearly needed
- Prefer editing existing files over creating new ones
- Preserve structure and conventions
- After edits: list changed files with reasons

---

## Behavioral guidelines

### 1. Think before coding
- State assumptions explicitly
- If multiple interpretations exist, present options
- Ask when unclear - do not guess
- Call out simpler approaches if they exist

### 2. Simplicity first
- Solve only the requested problem
- No speculative features or abstractions
- No unnecessary flexibility or configurability
- Avoid overengineering
- Prefer the smallest working solution

### 3. Surgical changes
- Modify only what is required
- Do not refactor unrelated code
- Match existing style
- Do not clean up unrelated code
- Remove only what your changes made unused

Test: every changed line must trace to the request

### 4. Goal-driven execution
- Define clear success criteria before coding
- For bugs: reproduce → fix → verify
- For features: define expected outcome → implement → verify
- For multi-step tasks:
  1. Step → verify
  2. Step → verify

## Content system

- Source: Notion → `scripts/syncNotion.mjs`
- Output: `/content/{blog,portfolio}/`
- Front matter includes: `notion_id`, `last_synced`

Rules:
- Do NOT rename/remove front matter fields
- Do NOT modify sync script unless explicitly asked
- Preserve content structure and links
- Assume markdown is machine-generated
- Make minimal edits to generated content

## Build
Notion → sync script → `/content/` → Hugo → `/public/`

## Paths
- Config: hugo.toml or config.*
- Content: content/
- Layouts: layouts/
- Partials: layouts/partials/
- Shortcodes: layouts/shortcodes/
- Assets: assets/
- Static: static/
- Workflow: .github/workflows/

## Templates
- Base: layouts/_default/
- Sections: layouts/blog/, layouts/portfolio/
- Components: layouts/partials/components/
- Widgets: layouts/partials/widgets/

Rules:
- Reuse existing partials before creating new ones
- Avoid broad template refactors
- Keep templates simple and consistent

## Styling
- Entry: assets/css/main.css
- Tailwind-based (theme-driven)

Rules:
- Prefer Tailwind utilities over custom CSS
- Do not introduce new styling systems

## JavaScript
- Minimal JS in assets/js/main.js

Rules:
- Avoid adding JS unless necessary
- Prefer Hugo/templates/CSS

## Routing
- `/` homepage
- `/blog/`
- `/portfolio/`
- `/about/`, `/contact/`

## Token efficiency
- Keep responses concise
- Do not print large files or logs
- Summarize instead of dumping content
- Stop reading once sufficient context is found
- Focus only on relevant files

## Output format
1. Brief plan
2. Minimal implementation
3. Files changed
4. Risks / follow-up