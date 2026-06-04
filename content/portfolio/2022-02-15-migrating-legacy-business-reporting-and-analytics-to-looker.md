---
id: '18'
title: Migrating legacy business reporting & analytics to Looker
meta_title: ''
description: >-
  A case study on rebuilding fragmented finance reporting into a governed
  ecosystem with dbt and Looker - eliminating manual board reporting and giving
  200+ stakeholders a source of truth.
intro: >-
  Most companies don’t struggle with a lack of data, but fragmented reporting,
  inconsistent definitions, manual processes, and unclear ownership - sound
  familiar? Migrating to [#dbt](/shipj.com/blog/?tags=dbt) and
  [#Looker](/shipj.com/blog/?tags=looker) addressed these issues head on, by
  centralising business reporting into a governed, scalable analytics platform
  used by 200+ stakeholders. Instead of *yet another BI migration*, the work
  focused on measurable outcomes: reliable board reporting, fewer ad-hoc fire
  drills, and a self-serve semantic layer the business could trust.
slug: migrating-legacy-business-reporting-and-analytics-to-looker
published_at: '2022-02-15'
categories:
  - BI
tags:
  - Looker
  - BigQuery
  - reporting
  - SQL
  - LookML
author: ''
length: Long (6-12 months)
sector: Tech
read_time: 20
series: ''
series_part: ''
type: portfolio
draft: false
notion_id: 3167fd6b-fd0d-8077-839d-e90a57c8f299
created_at: '2026-03-01T14:22:00.000Z'
last_edited_at: '2026-06-04T09:29:00.000Z'
last_synced: '2026-06-04T09:30:12.144Z'
math: true
image: ''
image_vertical: ''
---
# Objective

Finance reporting began almost 20 year ago in AccessDB, then spread across multiple legacy tools, manual workflows, and made their way into SQLServer

- Inconsistent metric definitions across teams

- Repetitive ad-hoc requests for analysis

- Board-level reporting built manually each month

- Limited visibility into ownership and data lineage

The result was inefficiency, duplication of effort, and limited trust in numbers.

The objective became: *“Design and implement an analytics ecosystem that delivers reliable, and self-service reporting across the organisation”*

# Requirements and stakeholder Alignment

From the outset this was treated as a cross-functional program rather than a technical upgrade.

### Stakeholder map

- Executive leadership - board reporting and KPI visibility

- Finance - accuracy and auditing

- Operations - real-time performance monitoring

- Data team - governance, modelling, and scalability

- Business users - self-service access to data and insights

### Requirements

1. Single source of truth for business metrics

1. Elimination of manual monthly reporting workflows

1. Scalable architecture across multiple warehouses

1. Governed, reusable data models

1. Self-service dashboards to reduce ad-hoc requests

1. Automation for recurring executive reporting

Clear documentation of requirements (and proactively sharing them) prevented scope drift and ensured alignment between technical architecture and business priorities.

# Architecture

The solution centred on moving towards modern analytics engineering tools including:

- **SQLServer → BigQuery** as a scalable data warehouse

- **Stored Procedures → dbt** for transformation and modeling

- **Excel → Looker** for semantic modeling and visualization

### High-Level Flow

```plain text
Data Source → BigQuery / Snowflake → dbt → Looker → Dashboards → Analysis Packs → Board Reports
```

### Data modeling

All reporting logic was consolidated into dbt providing:

- Version-controlled transformations

- Clear lineage and documentation

- Reusable, modular models

- Consistent metric definitions

By structuring the data layer correctly, downstream dashboards became simpler and more reliable.

### BI Migration and Dashboarding

All business reporting flows were migrated into Looker. This included:

- 100+ dashboards recreated for various departments

- Centralised metric governance

- Removal of legacy reporting tools

- Reduction in duplicated analytics efforts

Each dashboard was designed around defined stakeholder needs, not just available data.

The result was a structured analytics environment where 200+ users access insights through a unified platform.

# Automation

A key component of the value delivered was automation.

### Executive Analysis Packs

More than 10 recurring Analysis Packs referenced in monthly board meetings were fully automated. Previously manual and error-prone, these reports became:

- Standardised

- Reproducible

- Consistently aligned with source-of-truth metrics

This significantly reduced executive reporting preparation time while increasing confidence in the numbers.

### Looker API Automation

To support scale and governance, I developed Python scripts leveraging the Looker API to:

- Manage dashboard schedules

- Update and version content

- Monitor usage

- Streamline workflow management

This allowed BI administration to scale without proportional headcount growth.

### Complementary BI Suite in Excel and Google Sheets

While the core platform was centralised, some workflows required flexibility. I developed a structured Business Intelligence suite in Excel and Google Sheets to:

- Support offline reporting

- Handle specialised calculations

- Enable advanced scenario modelling

This bridged the gap between governed data infrastructure and practical business workflows.

# Project management

Beyond the technical build, delivery required disciplined project management.

### Governance Structure

- Defined ownership for datasets and dashboards

- Clear review cycles for metric definitions

- Structured migration timeline by business unit

### Phased Rollout

1. Stakeholder interviews and requirement gathering

1. Data model consolidation in dbt

1. Pilot dashboards for high-impact teams

1. Legacy tool decommissioning

1. Executive reporting automation

This phased approach minimised disruption while demonstrating incremental value early in the project lifecycle.

### Change Management

Centralisation only works if people adopt it. Adoption was driven by:

- Clear documentation

- Training sessions

- Structured onboarding

- Defined dashboard templates

Reducing friction increased long-term usage and decreased dependency on ad-hoc requests.

# Business impact

This work shifted reporting from “each team has their own version of the truth” to a governed platform with clear ownership.

### Centralised reporting at scale

- 200+ users across multiple business units using one BI platform

- 100+ dashboards recreated and rationalised around agreed definitions

- A single semantic layer (LookML) to standardise KPIs and reduce metric drift

### Time and efficiency gains

- 10+ recurring board-level Analysis Packs automated (previously manual)

- Monthly reporting moved from bespoke spreadsheets toward scheduled, repeatable outputs

- Fewer ad-hoc “can you pull this number?” requests as self-serve coverage increased

### Accuracy and transparency

- Clear data lineage via dbt + version control

- Standardised KPIs with documented ownership and review cycles

- More reliable board reporting because numbers traced back to the same governed definitions

## Data Engineering and Project Leadership in Practice

This project demonstrates the intersection of:

- Data architecture design

- Analytics engineering

- BI automation

- Executive reporting enablement

- Cross-functional stakeholder management

- Structured project delivery

The result was a resilient analytics ecosystem serving 200+ users, supporting board-level decision-making, and positioning the organisation for advanced data capabilities.

# Reflections

Centralisation requires more than technical execution. It requires:

- Clear stakeholder alignment

- Explicit metric definitions

- Governance from the start

- Automation wherever repetition exists

- Change management alongside engineering

What made this stick was treating it like a program: aligning stakeholders early, shipping in phases, and investing in enablement so the business could actually use what we built.
