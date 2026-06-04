---
id: '19'
title: Designing a semantic model and single source of truth with Looker
meta_title: ''
description: >-
  How designing a semantic model and encouraging a single source of truth led to
  a 90% reduction in analytics costs and a priceless view of our data
intro: >-
  The Design BI Data Model project created a <u>centralised </u>data model that
  served as a <u>single source of truth</u> for business reporting. I
  consolidated disparate reporting datasets into
  [#dbt](/shipj.com/blog/?tags=dbt) models surfaced through the
  [#Looker](/shipj.com/blog/?tags=looker) semantic layer, dramatically improving
  efficiency, reducing costs, and enabling scalable data-as-a-service
  capabilities.
slug: designing-a-semantic-model-and-single-source-of-truth-with-looker
published_at: '2022-10-14'
categories:
  - BI
tags:
  - Looker
  - dbt
  - BigQuery
  - Snowflake
  - GCP
author: ''
length: Medium (3-6 months)
sector: Tech
read_time: 5
series: ''
series_part: ''
type: portfolio
draft: false
notion_id: 3167fd6b-fd0d-80f1-9751-e0cf8d2ebf76
created_at: '2026-03-01T14:23:00.000Z'
last_edited_at: '2026-06-04T09:29:00.000Z'
last_synced: '2026-06-04T09:30:11.631Z'
math: true
image: ''
image_vertical: ''
---
# Objective

The task was always going to be complex, although we began with the finance migration



# Technical approach



# Data modeling

Designed a centralized BI data model in dbt, integrated with BigQuery and Snowflake, to ensure consistent metrics and definitions across the business.

Optimized queries using partitioning, clustering, and BI Engine, reducing analysis cost by 90%.

Ensured DRY[^1] code practices, creating reusable models across multiple reporting workflows.

# Governance

Created data dictionaries and documentation in dbt, providing transparency and maintainability.

Enabled analysts and engineers to explore lineage, metrics, and transformations easily, supporting self-service analytics.

Documentation later became critical as the business expanded into data-as-a-service offerings.

(Optional diagram: source data → dbt models → Looker semantic layer → dashboards / DaaS outputs.)

# Outcomes

Single source of truth for all business reporting, increasing confidence in analytics.

Reduced analysis cost by 90%, freeing compute resources and accelerating reporting.

Reusable, maintainable models reduced duplication and improved efficiency across teams.

Documentation and governance supported scaling into data-as-a-service and other downstream projects.

# Next steps

Expanding self-service access with additional metrics and dashboards.

Integrating real-time or near-real-time updates for operational analytics.

Extending governance and lineage tracking across forecasting, ML, and DaaS pipelines.

Automating quality checks and monitoring to maintain reliability as data sources grow.

(Leave space for reflections, lessons learned, or planned improvements.)

[^1]: DRY: Don’t Repeat Yourself - …
