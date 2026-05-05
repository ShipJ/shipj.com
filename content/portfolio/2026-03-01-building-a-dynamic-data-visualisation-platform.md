---
id: '10'
title: Building a Dynamic Data Visualisation Platform
meta_title: ''
description: Using FastAPI and Highcharts to build a custom chart visualisation platform
tldr: >-
  Building a Dynamic Data Visualisation Platform with FastAPI and Highcharts for
  Business Intelligence
slug: building-a-dynamic-data-visualisation-platform
date: '2026-05-05T21:51:09.645Z'
categories:
  - Data Analytics
tags:
  - FastAPI
  - APIs
  - Dash
  - Highcharts
  - GCP
  - self-serve
author: Jack
length: Medium (3-6 months)
sector: General
read_time: ''
series: A new career
series_part: '15'
type: portfolio
draft: false
notion_id: 3167fd6b-fd0d-80c1-9bc1-e10cad0ba788
created_at: '2026-03-01T14:04:00.000Z'
last_edited_at: '2026-05-05T19:11:00.000Z'
last_synced: '2026-05-05T21:51:09.645Z'
math: true
image: ''
---
<br>

## Project Overview

The Dynamic Data Visuals project was designed to transform how business users interact with data by automating the creation of interactive, error-free charts and dashboards. I built a Highcharts-based visualization service hosted on Google Cloud Platform (GCP), integrated with Dash and FastAPI, to connect directly with core databases. This framework empowers over 100 business users to generate visuals on demand—no coding required—reducing time-to-insight and eliminating human error in data visualization workflows.

### Technologies and Approach

**Architecture & Framework:**

- Developed a custom Highcharts wrapper on GCP, enabling consistent branding and functionality across all visuals.

- Integrated Dash for interactivity and FastAPI for backend orchestration and API-driven visual generation.

- Connected directly to core production databases, ensuring all charts reflect real-time data.

**Automation & Scalability:**

- Designed a fully automated build process, generating validated visualizations without manual intervention.

- Built parameterized endpoints to allow non-technical users to define filters, metrics, and visual types.

- Implemented a CI/CD pipeline for continuous deployment and updates of new visualization templates.
(Optionally add a diagram of architecture — GCP → FastAPI → Dash → Highcharts → End-user.)

### Team Enablement & Workflow Transformation

- Enabled 100+ business users to create and publish their own visuals through a simple interface, removing dependencies on data engineering teams.

- Saved an average of 30 minutes per chart, dramatically improving turnaround for ad-hoc reporting.

- Reduced human error to zero by automating the data extraction and chart generation process.

- Provided documentation and lightweight training to ensure smooth adoption across departments.

### Impact & Outcomes

- Increased productivity: 100+ users empowered to self-serve visual analytics.

- Time savings: ~30 minutes saved per chart, compounding into hundreds of hours monthly.

- Consistency & reliability: Automated visual generation eliminated discrepancies between reports.

- Scalable infrastructure: Built on GCP, easily extensible to new datasets and teams.
(You could expand here with metrics like total visuals created, user satisfaction rates, or before/after comparisons.)

### Future Expansion

- Future improvements and opportunities include:

- Extending the framework to support additional chart libraries (e.g., Plotly, ECharts).

- Integrating real-time streaming data for live operational dashboards.

- Deploying access control and personalization features for tailored user experiences.

- Exploring LLM-assisted visualization requests, allowing users to generate charts via natural language prompts.
(Leave space for your own commentary on what’s next, lessons learned, or potential integrations.)
