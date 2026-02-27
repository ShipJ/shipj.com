---
title: "💼 Building a Dynamic Data Visualisation Platform"
meta_title: "Building a Dynamic Data Visualisation Platform"
description: "Using FastAPI and Highcharts to build a custom chart visualisation platform"
slug: "4-using-fastapi-highcharts-to-build-a-custom-visualisation-platform"
date: 2023-09-01T05:00:00Z
length: "Long Term (6-12m)"
categories: ["Data Engineering", "Data Architecture", "Data Analytics"]
author: "Jack"
tags: ["FastAPI", "Dash", "Highcharts", "GCP", "APIs", "Self-Serve"]
image: "/images/gallery/04.jpg"
draft: false
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
