---
id: '18'
title: 'Migrating to Looker: Centralised Business Reporting & Analytics'
meta_title: >-
  Migrating to Looker: Centralising Business Reporting & Analytics for Enhanced
  Data Insights
description: 'Migrating to Looker: Centralising Business Reporting & Analytics'
slug: migrating-to-looker-centralised-business-reporting-and-analytics
date: '2026-04-24T15:14:44.533Z'
categories:
  - Data Engineering
  - Data Governance
  - Business Intelligence
tags:
  - Looker
  - dbt
  - BigQuery
  - Snowflake
  - reporting
  - SQL
  - LookML
author: Jack
length: Long (6-12 months)
read_time: 5
type: portfolio
draft: false
notion_id: 3167fd6b-fd0d-8077-839d-e90a57c8f299
created_at: '2026-03-01T14:22:00.000Z'
last_edited_at: '2026-04-18T09:30:00.000Z'
last_synced: '2026-04-24T15:14:44.533Z'
math: true
image: /images/gallery/screenshot-2026-03-02-at-165238.png
---
Most companies don’t struggle with a lack of data, but fragmented reporting, inconsistent definitions, manual processes, and unclear ownership - sound familiar?

Migrating to **Looker** addressed these issues head on, by centralising business reporting into a governed, scalable analytics platform used by 200+ stakeholders.

This project was not a tool migration but an architecture redesign, a stakeholder alignment exercise, and a training program to deliver measurable business value.

---

## Business Problem

Finance reporting began in AccessDB lived in multiple legacy tools and manual workflows:

- Inconsistent metric definitions across teams

- Repetitive ad-hoc requests for analysis

- Board-level reporting built manually each month

- Limited visibility into ownership and data lineage

The result was inefficiency, duplication of effort, and limited trust in numbers.

The objective became: *“Design and implement an analytics ecosystem that delivers reliable, and self-service reporting across the organisation”*

---

## Requirements and Stakeholder Alignment

From the outset, this was treated as a cross-functional program rather than a technical upgrade.

### Key Stakeholders

- Executive leadership (board reporting and KPI visibility)

- Finance (accuracy and auditability)

- Operations and Growth teams (real-time performance monitoring)

- Data team (governance, modeling, and scalability)

- Business users (self-service access to insights)

### Core Requirements

1. Single source of truth for business metrics

1. Elimination of manual monthly reporting workflows

1. Scalable architecture across multiple warehouses

1. Governed, reusable data models

1. Self-service dashboards to reduce ad-hoc requests

1. Automation for recurring executive reporting

Clear documentation of requirements prevented scope drift and ensured alignment between technical architecture and business priorities.

---

## Architecture and Technical Approach

The solution centred on modern analytics engineering principles using:

- **dbt** for transformation and modeling

- **Looker** for semantic modeling and visualization

- **BigQuery** and **Snowflake** as scalable data warehouses

### High-Level Flow

```plain text
Data Source → BigQuery / Snowflake → dbt models → Looker → Dashboards → Analysis Packs → Board Reports
```

### Data Engineering and Modeling

All reporting logic was consolidated into dbt providing:

- Version-controlled transformations

- Clear lineage and documentation

- Reusable, modular models

- Consistent metric definitions

By structuring the data layer correctly, downstream dashboards became simpler and more reliable.

### BI Migration and Dashboarding

All business reporting flows were migrated into Looker. This included:

- 100+ dashboards built for various departments

- Centralised metric governance

- Removal of legacy reporting tools

- Reduction in duplicated analytics efforts

Each dashboard was designed around defined stakeholder needs, not just available data.

The result was a structured analytics environment where 200+ users access insights through a unified platform.

---

## Automation and Workflow Engineering

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

---

## Project Management and Delivery Framework

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

---

## Business Impact

### Centralised Reporting at Scale

- 200+ users across multiple business units

- 100+ dashboards

- Unified semantic layer and metric governance

### Time and Efficiency Gains

- Automated 10+ board-level Analysis Packs

- Reduced manual recurring analysis

- Significant reduction in ad-hoc reporting requests

### Improved Accuracy and Transparency

- Single source of truth

- Clear data lineage

- Version-controlled transformations

- Standardized KPIs

The organization moved from reactive reporting to structured, scalable analytics.

---

## Value Delivered

The measurable value extended beyond dashboards:

- Stronger executive decision-making through consistent board reporting

- Reduced operational inefficiencies

- Increased trust in data

- Scalable data architecture across BigQuery and Snowflake

- Governed analytics engineering practices via dbt

This was not a reporting project. It was an organisational data maturity shift.

---

## Future Expansion

The architecture was designed with extensibility in mind. Next steps may include:

- Real-time dashboards and alerting

- Predictive metrics and forward-looking KPIs

- Self-service tutorials and dashboard templates

- Enhanced visualisation and data storytelling techniques

- Expanded monitoring and data quality automation

The foundation supports advanced analytics without requiring structural redesign.

---

## Reflections and Lessons Learned

Centralisation requires more than technical execution. It requires:

- Clear stakeholder alignment

- Explicit metric definitions

- Governance from the start

- Automation wherever repetition exists

- Change management alongside engineering

The combination of data architecture, automation, and structured program management enabled this initiative to scale sustainably.

---

## Data Engineering and Project Leadership in Practice

This project demonstrates the intersection of:

- Data architecture design

- Analytics engineering

- BI automation

- Executive reporting enablement

- Cross-functional stakeholder management

- Structured project delivery

The result was a resilient analytics ecosystem serving 200+ users, supporting board-level decision-making, and positioning the organisation for advanced data capabilities.

If your organisation is facing fragmented reporting, manual executive workflows, or scaling challenges in analytics infrastructure, the solution is rarely just a new tool. It requires cohesive architecture, governance, automation, and disciplined delivery.
