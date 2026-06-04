---
id: '33'
title: My experience with Lovable so far
meta_title: ''
description: >-
  Incredible at prototyping, but creaky foundations and over-confidence led to
  more caution than productivity
slug: my-experience-with-lovable-so-far
published_at: '2026-01-21'
categories:
  - Web Dev
tags:
  - lovable
  - supabase
  - vibe-coding
author: ''
length: Quick Read
sector: Tech
read_time: 8
series: Migrating from Lovable
series_part: '1'
type: blog
draft: false
notion_id: 3597fd6b-fd0d-8044-a148-c68a0b3da4e4
created_at: '2026-05-07T13:55:00.000Z'
last_edited_at: '2026-06-04T09:29:00.000Z'
last_synced: '2026-06-04T09:30:09.245Z'
math: true
image: ''
image_vertical: ''
---
A friend recently pitched a new business idea and I was intrigued (and unemployed) enough to say: *“let’s give it a go”.*

This was my first attempt at building an app as a side project with someone else. We wanted to move quickly, test some ideas, and build something tangible rather than spending weeks talking about abstract concepts. 

So we started with [#Lovable](/shipj.com/blog/?tags=lovable) (sorry [#Replit](/shipj.com/blog/?tags=replit)). You can get started [here](https://lovable.dev/).

And I get the hype.

The first few hours were so impressive. I am still blown away by how much can be one-shotted[^1]. Screens appeared, flows came together, database interactions *worked. *Components looked clean. The gap between *“should we build this”* and *“here is a working version”* was absurdly small.

For prototyping, that is powerful. But then reality kicked in.

### The realities of building something real

The first alarm bells were around the parts of the product that matter most once you move beyond the demo: security, permissions, authentication, database structure, and row-level security.

`> Please grant permission to Jack on this account ` 

I am not a backend developer but am experienced with databases, which made this process exciting and uncomfortable. Lovable was great at helping us move quickly, but I started to feel the limits of working inside a system where I could interface with its version of the database, but not really own the backend architecture in the way I wanted to. 

I couldn’t play with it in the usual sense, and that made me nervous. Once we started thinking seriously about user roles, permissions, protected data, and how different users should interact with different parts of the app, how users might be provisioned, and how support might be had, speed was not enough when we needed to understand the architecture, not just generate more screens, more tables, and more columns

At this point, [#claude-code](/shipj.com/blog/?tags=claude-code) became central to the workflow.

Not because it could write code, but its level of reasoning. It was better at thinking through architectural decisions: what is reusable, what might break elsewhere, how a permissions model should be structured, and where the risks were. I’m sure you’ve noticed by now if you ask claude or codex or whatever copilot you use, it *will* try to implement something. Nothing is too big an ask, and there usually isn’t much pushback.

For me this is a big moment in the AI boom - that’s where the best learning opportunities used to be. 

The issue was that the workflow became increasingly awkward. Whenever Claude suggested updates to an edge function or changes to the database itself, those changes had to be run manually. That became a blocker. The more serious the app became, the more we felt the drag. Progress slowed, creativity stopped.

We reached the inevitable: should we just remix the project and start again? Going from 0-90 is almost instantaneous, but the 10% is still there, and it’s significant, perhaps more than before.

### The moment we knew we had to move

The turning point came when I saw how effectively Claude could work with ERDs directly in Miro. That changed the way I thought about the project. Instead of prompting screen-by-screen, we could reason through the underlying system: users, organisations, permissions, relationships, policies, and data flows. Designing the authentication and permissions model suddenly felt like something we could properly map, critique, and improve before blindly implementing it. 

We were limited in that we could only interface with Supabase via Lovable, and any database operations required additional work on Lovable’s side. We wanted Claude to have full access.

That was the moment Lovable started to feel less like the right place to keep building, and more like the right place to have started. So we decided to migrate away from Lovable and rebuild around a stack we could control: Claude for planning and implementation support, our own Supabase project for the backend, and Vercel for hosting.

### Reflections

I still think Lovable is magic.

To go from idea to prototype with one prompt it is impressive. It has all but elimimated the barrier to entry for side projects that usually die before anyone sees anything. Lovable helps to skip that dead zone, but is that a good thing? 

> Building a prototype and building a product are not the same thing.

The moment your app needs serious permissions, secure data handling, row-level security, and a backend you understand and can trust, the trade-offs are more obvious. Moving fast is useful, but only if you know what you are moving from, through, and towards.

For us, Lovable was the spark to prove that there was something worth building and that it could be fun - you don’t *need* to understand everything before you build any more, and that barrier is getting lower and lower.

But once the product started to become real, we needed more control, more visibility, and more confidence in its foundations.

[^1]: One-shotted: completed successfully from a single prompt, without requiring rounds of revisions or retries
