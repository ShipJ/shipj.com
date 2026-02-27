---
title: "💼 Designing a Semantic Model and encouraging a Single Source of Truth"
meta_title: "Designing our Semantic Model and encouraging a Single Source of Truth"
description: "Designing our Semantic Model and encouraging a Single Source of Truth"
slug: "13-designing-semantic-model-encouraging-single-source-truth"
date: 2021-10-01T05:00:00Z
length: "Long Term (6-12m)"
categories: ["Data Engineering", "Data Architecture"]
author: "Jack"
tags:
  [
    "Looker",
    "LookML",
    "dbt",
    "BigQuery",
    "Snowflake",
    "Excel",
    "Business Intelligence",
  ]
image: "/images/gallery/07.jpg"
draft: false
---

<br>

## Overview

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
