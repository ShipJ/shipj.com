---
id: '19'
title: Designing a Semantic Model and encouraging a Single Source of Truth
meta_title: ''
description: Designing a Semantic Model and encouraging a Single Source of Truth
tldr: ''
slug: designing-a-semantic-model-and-encouraging-a-single-source-of-truth
date: '2026-05-05T21:51:10.971Z'
categories:
  - Data Analytics
tags:
  - Looker
  - dbt
  - BigQuery
  - Snowflake
  - GCP
author: Jack
length: Medium (3-6 months)
sector: General
read_time: ''
series: A new career
series_part: '22'
type: portfolio
draft: false
notion_id: 3167fd6b-fd0d-80f1-9751-e0cf8d2ebf76
created_at: '2026-03-01T14:23:00.000Z'
last_edited_at: '2026-05-05T19:12:00.000Z'
last_synced: '2026-05-05T21:51:10.971Z'
math: true
image: ''
---
<br>

# Overview

The Design BI Data Model project created a centralized, optimized data model that served as a single source of truth for business reporting.

I consolidated disparate reporting datasets into dbt models surfaced through Looker’s semantic layer, dramatically improving efficiency, reducing costs, and enabling scalable data-as-a-service capabilities.

Core Technologies and Approach

Data Modeling & Optimization:

Designed a centralized BI data model in dbt, integrated with BigQuery and Snowflake, to ensure consistent metrics and definitions across the business.

Optimized queries using partitioning, clustering, and BI Engine, reducing analysis cost by 90%.

Ensured DRY (Don’t Repeat Yourself) code practices, creating reusable models across multiple reporting workflows.

Documentation & Governance:

Created data dictionaries and documentation in dbt, providing transparency and maintainability.

Enabled analysts and engineers to explore lineage, metrics, and transformations easily, supporting self-service analytics.

Documentation later became critical as the business expanded into data-as-a-service offerings.

(Optional diagram: source data → dbt models → Looker semantic layer → dashboards / DaaS outputs.)

Impact & Outcomes

Single source of truth for all business reporting, increasing confidence in analytics.

Reduced analysis cost by 90%, freeing compute resources and accelerating reporting.

Reusable, maintainable models reduced duplication and improved efficiency across teams.

Documentation and governance supported scaling into data-as-a-service and other downstream projects.

Future Expansion

Potential next steps include:

Expanding self-service access with additional metrics and dashboards.

Integrating real-time or near-real-time updates for operational analytics.

Extending governance and lineage tracking across forecasting, ML, and DaaS pipelines.

Automating quality checks and monitoring to maintain reliability as data sources grow.

(Leave space for reflections, lessons learned, or planned improvements.)
