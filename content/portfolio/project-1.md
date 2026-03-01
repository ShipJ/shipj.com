---
title: "💼 TrendCurve AI: From Forecasting to Scalable Intelligence"
meta_title: "Designing TrendCurve AI: From Forecasting to Scalable Intelligence"
description: "They key data science and engineering principles behind building a customer-facing forecasting product"
slug: "1-designing-trendcurve-ai-forecasting-scalable-intelligence"
date: 2021-05-01T05:00:00Z
length: "Very Long Term (>12m)"
categories:
  ["Data Science", "Data Engineering", "Data Architecture", "Management"]
author: "Jack"
tags:
  [
    "python",
    "time-series",
    "prophet",
    "chronos",
    "nixtla",
    "LSTM",
    "Machine Learning",
    "Forecasting",
    "MLOps",
    "Automation",
    "R&D",
    "Product Development",
  ]
image: "/images/gallery/01.jpg"
draft: false
---

<br>

## Project Overview

["TrendCurve AI"](https://www.wgsn.com/en/trading/fashion-buying) was WGSN's first large‑scale step into data‑driven forecasting — a product designed to anticipate consumer trends using time‑series modelling, deep learning, and hierarchical data structures across a range of proprietary datasets.

As the lead data scientist and engineer, I was responsible for taking early prototypes and turning them into a production‑grade forecasting engine used by hundreds of fashion and retail clients. The work spanned product definition, model design, data architecture, and the organisational change required to embed data‑led decision‑making into an established trend‑forecasting business.

<br>

### Technologies and Approach

**Classical vs modern approaches:** Early iterations used [Prophet](https://facebook.github.io/prophet/) and classical statistical baselines to establish reliable benchmarks and build trust with stakeholders. As the product matured, we moved to hierarchical forecasting to capture both top‑down and bottom‑up behaviour across categories, regions, and time horizons.

**Deep learning expansion:** We introduced LSTM and Transformer‑based architectures (leveraging open‑source tooling such as Nixtla and Chronos) to handle multi‑step forecasts, cross‑series correlations, and sparse seasonal signals. This allowed us to model complex product life‑cycles and promotional effects that were difficult to capture with classical methods alone.

**Feature engineering & drift monitoring:** We invested heavily in feature pipelines — combining proprietary trend signals, sell‑through data, macro indicators, and calendar effects — and paired this with automated drift monitoring. Retraining cadence and feature selection were driven by monitored performance rather than fixed schedules, helping maintain >90% accuracy across key segments.

<br>

### Engineering Foundations

- Built a modular data platform to support ingestion, transformation, and feature computation across multiple internal and external data sources.
- Established CI/CD workflows for model retraining and deployment, including automated evaluation gates, drift alerts, and audit trails.
- Developed internal APIs and integration layers so that TrendCurve AI forecasts could be surfaced directly in WGSN’s client‑facing products, without duplicating logic across teams.

From a systems perspective, the architecture was designed to be resilient to upstream schema changes, cost‑aware at scale, and simple enough for non‑ML engineers to extend.

<br>

### Team Enablement, R&D & Leadership

Beyond technical delivery, a significant part of the work was making sure the organisation could understand, trust, and continually improve the product:

- Designed and ran internal training for 10+ non‑technical colleagues (editors, merchandisers, product managers) so they could interpret forecasts, understand confidence intervals, and give structured feedback.
- Founded an internal <u>Research Hub</u> to coordinate R&D into scalable forecast automation, hierarchical modelling, and transformer‑based architectures, ensuring experimentation fed back into the product roadmap.
- Worked with design, editorial, and commercial leaders to define how TrendCurve AI would show up in client‑facing experiences, aligning metrics and narratives so that “AI” features were understandable and actionable.
- Introduced lightweight governance around experiment tracking, evaluation standards, and documentation so future teams could build on the foundations rather than start from scratch.

<br>

### Impact & Outcomes

TrendCurve AI shifted forecasting from a largely manual, expert‑driven process to a repeatable, data‑driven capability:

- £3m+ annual recurring revenue directly attributable to the TrendCurve AI product line.
- >90% model accuracy maintained over the production lifecycle across priority categories.
- Significant reduction in manual workload by automating routine insight generation, freeing editorial teams to focus on strategic analysis and storytelling.
- A sustainable R&D pipeline and technical foundation that allowed WGSN to continue evolving its forecasting capabilities without rebuilding the stack each time.

<br>

### Future Expansion

The foundations laid by TrendCurve AI opened several clear avenues for future work:

- Integrating multimodal models combining text, image, and time‑series inputs to better capture trend narratives, visual signals, and quantitative performance in a single system.
- Deploying explainability frameworks (e.g. SHAP) to make drivers of change more transparent for commercial decision‑makers, not just data teams.
- Exploring real‑time trend “nowcasting” powered by transformer encoders, allowing clients to react faster to shifts in demand, sentiment, and competitive activity.

In other words: this was not just a one‑off forecasting project, but the backbone for a broader data and AI strategy inside a global trend‑forecasting business.
