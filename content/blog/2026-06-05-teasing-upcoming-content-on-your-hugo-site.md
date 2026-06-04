---
id: '36'
title: Teasing upcoming content on your Hugo site
meta_title: ''
description: >-
  How to add a lightweight, page-level flag to tease upcoming posts without
  revealing their content.
slug: teasing-upcoming-content-on-your-hugo-site
published_at: '2026-06-05'
categories:
  - Web Dev
tags:
  - Hugo
  - Notion
  - tutorial
author: ''
length: Quick Read
sector: ''
read_time: 5
series: Building this site
series_part: '4'
type: blog
draft: false
notion_id: 3617fd6b-fd0d-8073-83de-df92e0f8b5ea
created_at: '2026-05-15T12:59:00.000Z'
last_edited_at: '2026-06-04T09:29:00.000Z'
last_synced: '2026-06-04T09:30:08.945Z'
math: true
image: /images/gallery/chatgpt-image-jun-3-2026-064725-pm.png
image_vertical: /images/gallery/chatgpt-image-jun-3-2026-064725-pm.png
coming_soon: true
build:
  render: never
  list: always
---
### Objective

I wanted a quick and easy way to surface upcoming content: posts scheduled for a future publish date. These should appear in listings as “coming soon” but should not yet be readable or linked to a full post.

### The trick

Hugo has a page-level parameter called `build` with the following sub-parameters:

- `render: never` - skips HTML generation entirely taking you to a 404

- `list: always` - keeps the page in the `site.RegularPages` collection, which means it still appears in lists

That, combined with `buildFuture = true` at the top of `hugo.toml`, future-dated posts now live in the build data but content never leaks.

### Wiring it up

Inside my sync script `syncNotion.mjs` before each post is written out, we check:

```sql
if (fm.published_at && new Date(fm.published_at) > new Date()) {
	cleanFm.coming_soon = true;
	cleanFm._build = { render: "never", list: "always" };
}
```

Any post marked `is_published` with a future date gets the treatment automatically. In the templates, every card, rail item and quick-reads tile checks `.Params.coming_soon`. If true, swap the `<a>` tags for `<span>` (no link, no card-click), and replace the date with the words *"Coming soon"*. Add a `.is-coming-soon` class so the whole thing greys out. A few lines of CSS handled the rest:

```sql
.is-coming-soon {
	opacity: 0.55;
	cursor: default;
}
```

Side-note - I also exclude `coming_soon` posts from the "Latest post" slot on the homepage, otherwise the upcoming piece would muscle the most recent published one out of view.

### Why it's elegant

The article enters my pipeline the moment `is_published` is switched in Notion, even if I'm drafting. Readers see what's queued without me having to maintain a parallel list of content, and because the URL genuinely 404s, no half-finished work gets leaked. One config flag, one small tweak, and a conditional sprinkled through the listing partials. Done.
