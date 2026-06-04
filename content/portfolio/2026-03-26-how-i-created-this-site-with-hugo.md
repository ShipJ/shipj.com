---
id: '21'
title: How I created this site with Hugo
meta_title: ''
description: >-
  A detailed look at how I designed and built this site with Hugo, deployed it
  using GitHub Actions, integrated it with Notion, and implemented some clever
  features with Claude’s help.
intro: >-
  As a computer scientist, building your own website is a rite of passage. I
  built this site with a simple goal in mind: I wanted to write in Notion and
  publish to something I fully own. No platform lock-in, no monthly fees, and no
  wrestling with a CMS to nudge margins. Just a fast static site, my own
  templates, and a deployment pipeline that runs when I push.
slug: how-i-created-this-site-with-hugo
published_at: '2026-03-26'
categories:
  - Web Dev
tags:
  - goals
  - Hugo
  - Notion
  - claude
  - tutorial
author: ''
length: Short (1-2 weeks)
sector: Tech
read_time: 5
series: Building this site
series_part: '1'
type: portfolio
draft: false
notion_id: 3177fd6b-fd0d-80fd-ae51-d136cfde666d
created_at: '2026-03-02T14:07:00.000Z'
last_edited_at: '2026-06-04T10:55:00.000Z'
last_synced: '2026-06-04T12:50:55.742Z'
math: true
image: /images/gallery/chatgpt-image-jun-3-2026-080904-pm.png
image_vertical: /images/gallery/chatgpt-image-jun-3-2026-081013-pm.png
---
I’m currently migrating away from [#Lovable](/shipj.com/blog/?tags=lovable), for reasons I’ll unpack in another series. This time, I wanted the opposite experience: fewer abstractions, fewer black boxes, and complete ownership of the foundations.

That led me to [#Hugo](/shipj.com/blog/?tags=hugo): a fast, flexible static site generator that gave me control over the structure, templates, and deployment flow from the start.

If you’re here to learn about [#Notion](/shipj.com/blog/?tags=notion), including some of the cool, more advanced integration details, that’s covered in part 2 of this series.

# **The stack**

A quick tour of what’s under the hood:

- **Hugo** - a static site generator. Content is markdown, builds are near-instant, and the output is plain HTML/CSS/JS that any host will happily serve.

- **hugoplate** - the Hugo + Tailwind boilerplate I started from (thanks zeon.studio). It gave me a sane structure I could then bend to my own taste rather than starting from scratch.

- **Tailwind CSS v4** - utility-first styling via **`@tailwindcss/cli`**, with a custom CSS layer for some shared components that utilities can’t express cleanly.

- **Notion** - my CMS. I write everything in Notion and sync it into Hugo’s **`content/`** folder.

- **GitHub Pages + Actions** - free hosting and an automated CI/CD deploy on every push.

# **Why Hugo**

Speed and control, mostly. There’s no database to babysit and no server to keep alive - the build spits out static files and that’s the whole site. I own every template in **`layouts/`**, so when I want a card to behave differently or a series to lay out a certain way, I change the template instead of wrestling a theme.

It’s intentionally boring, which means nothing breaks while I sleep.

# **Notion as a CMS**

I didn’t want my writing to live in markdown files scattered across a repo. Notion is an incredible tool, where I think, make lists, create ..  - clean editor, databases, relations - so I made it the source of truth and let the repo build on top.

A small node script ([**scripts/syncNotion.mjs**](https://github.com/ShipJ/shipj.com/blob/main/scripts/syncNotion.mjs)) does the heavy-lifting: it queries my [#Notion](/shipj.com/blog/?tags=notion) database for published pages, converts the blocks to markdown, drops them into **`content/blog/`** or **`content/portfolio/`**, and stamps each file with front matter - including a **`notion_id`** and **`last_synced`** so re-runs overwrite the right file instead of spawning duplicates. The sync is one-way: Notion leads, the site follows.

# **Deploying with GitHub Actions**

This is the part that makes the whole thing feel effortless. Push to **`main`** and a workflow (**`.github/workflows/hugo.yml`**) wakes up, installs Hugo (extended) and Dart Sass, builds the site with **`--gc --minify`**, and publishes the **`public/`** output straight to GitHub Pages.

`on:
  push:
    branches:
      - main
  workflow_dispatch:`

There’s no manual deploy step anywhere. I write in Notion, sync, push, and the live site updates a couple of minutes later.

# **The local loop**

While I’m working, one command does everything:

`npm run dev`

That syncs Notion first, then boots **`hugo server`**. I run it with **`--disableFastRender --ignoreCache`** so I’m never squinting at a stale build wondering why my change didn’t show up - a small thing that saved me a lot of confused refreshing early on.

# **What’s next**

This is part 1 - the overview. The rest of *Building this site* goes deeper into the bits that were actually fun to solve:

- **Part 2** - syncing Notion to Hugo, step by step.

- **Part 3** - how I organise blog vs portfolio content, series, and AI-generated summaries.

- **Part 4** - teasing upcoming posts with a single front-matter flag.

None of these pieces are clever on their own. But stitched together - Notion to write, Hugo to render, Actions to ship - they give me a site I fully understand and can change in an afternoon. That, more than anything, was the point.
