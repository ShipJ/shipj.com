---
id: '36'
title: 'Teasing ‘coming soon’ posts with Hugo '
meta_title: ''
description: >-
  Adding a lightweight, page-level flag that teases draft posts in listings
  without leaking their content.
slug: teasing-coming-soon-posts-with-hugo
published_at: '2026-06-05'
categories:
  - Web Development
tags:
  - Hugo
  - Notion
  - tutorial
author: Jack
length: Quick Read
sector: ''
read_time: ''
series: Building this site
series_part: '4'
type: blog
draft: false
notion_id: 3617fd6b-fd0d-8073-83de-df92e0f8b5ea
created_at: '2026-05-15T12:59:00.000Z'
last_edited_at: '2026-06-01T12:08:00.000Z'
last_synced: '2026-06-01T12:08:25.269Z'
math: true
image: ''
coming_soon: true
build:
  render: never
  list: always
---
### Objective

I wanted a quick way to tease posts that aren’t quite ready to publish as *“coming soon”.* I wanted this to be visible in listings, but not yet readable or hyperlinked. 

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

Any post marked as `is_published` with a future date gets the treatment automatically. In the templates, every card, rail item and quick-reads tile checks `.Params.coming_soon`. If true, swap the `<a>` tags for `<span>` (no link, no card-click), and replace the date with the words *"Coming soon"*. Add a `.is-coming-soon` class so the whole thing greys out. A few lines of CSS handled the rest:

```sql
.is-coming-soon {
	opacity: 0.55;
	cursor: default;
}
```

I also exclude coming_soon posts from the "Latest post" slot on the homepage — otherwise the upcoming piece would muscle the most recent published one out of view.

### Why it's elegant

The article enters my pipeline the moment `is_published` is switched in Notion, even if I'm drafting. Readers see what's queued without me having to maintain a parallel list of content. Because the URL genuinely 404s, no half-finished work leaks early. One config flag, one small tweak, and a conditional sprinkled through the listing partials. Done.
