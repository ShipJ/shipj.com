---
id: '23'
title: Analytics engineering technical test travails with dbt and DuckDB
meta_title: >-
  Analytics Engineering Technical Test Travails – DBT, DuckDB, Lightdash,
  Docker, SQL, Data Engineering Portfolio – Jack’s Staff Data Engineer Interview
  Experience (Transport Sector)
description: >-
  A case study on completing a Staff Data Engineer technical test with dbt,
  DuckDB, and Lightdash, covering modelling decisions, data quality checks, BI
  design, and trade-offs in take-home tasks.
intro: >-
  I recently completed a technical test for a Staff Data Engineer role at a
  large energy provider. The brief was framed as a short exercise, but touched
  on several areas that matter in real analytics engineering work: modelling,
  testing, documentation, reproducibility, and how analytical outputs are
  consumed by stakeholders.


  The task revolved around [Dutch railway
  data](https://www.rijdendetreinen.nl/en/open-data) and came with a
  [#dbt](/shipj.com/blog/?tags=dbt) project pointed at
  [#DuckDB](/shipj.com/blog/?tags=duckdb). My job was to extend the models,
  answer some analytical questions, and consider how the results could be
  exposed through a BI layer such as
  [#Lightdash](/shipj.com/blog/?tags=lightdash). This post walks through how I
  approached the work, the modelling decisions I made, what I built, and what I
  would do differently next time.
slug: analytics-engineering-technical-test-travails-with-dbt-and-duckdb
published_at: '2026-01-23'
categories:
  - Data Engineering
tags:
  - dbt
  - lightdash
  - postgres
  - docker
  - SQL
  - python
  - DuckDB
author: Jack
length: Short (1-2 weeks)
sector: Transport
read_time: 5
series: A new career
series_part: '3'
type: portfolio
draft: false
notion_id: 3177fd6b-fd0d-809c-a546-f113f328e96f
created_at: '2026-03-02T21:58:00.000Z'
last_edited_at: '2026-06-01T08:14:00.000Z'
last_synced: '2026-06-01T08:14:10.250Z'
math: true
image: ''
---
# **It’s a tough market**

Breaking into the tech industry isn’t getting easier, and technical tests are getting more imaginative. It’s great to see creativity in interview processes, to align with the reality of role expectations, but there has to be a limit.

I applied for a Staff Data Engineer role at a well-known energy provider and performed well in early rounds: HR screen, team introduction, and general technical discussion. The role sounded like a great fit - data modelling, analytics engineering, stakeholder-facing work, and the realities of building and maintaining reliable pipelines are my comfort zones.

Of course it wouldn’t be a technical test without the familiar warning:

> Don’t spend more than a few hours on this…

Ha. Anyone who has done one of these tests knows what that means - the task is scoped as though it should take a few hours, but the expectations around structure, correctness, modelling judgement, documentation, tests, code style, and evidence are so broad, that it’s hard not to think beyond the bare minimum.

I’m on the job hunt and have nothing to lose, so I set to work cloning the repo straight away. I was genuinely interested in the problem space and felt comfortable with the tooling, particularly [#dbt](/shipj.com/blog/?tags=dbt).

That said, I can’t help but feel I lost out partly because expectations for senior data roles are becoming increasingly elastic. This is the third interview process recently where I half expected someone to ask: “Can you actually perform magic in this role?” Between AI agents, modern data stacks, orchestration, BI, semantic layers, stakeholder management, platform ownership, and cost optimisation, the scope can diverge rapidly.

# Objective

I was asked to clone a [#dbt](/shipj.com/blog/?tags=dbt) repo with some pre-defined staging models pointed at [#DuckDB](/shipj.com/blog/?tags=duckdb), model the data, and answer a set of analytical questions. The final question asked how the outputs might be visualised in a BI tool such as [#lightdash](/shipj.com/blog/?tags=lightdash). 

You can see the repo with my solutions [here](https://github.com/ShipJ/dbt-dutch-railway).

The dataset related to [Dutch railway data](https://www.rijdendetreinen.nl/en/open-data), which gave the task a realistic touch. It was not just a case of writing a few SQL queries; the exercise required critically thinking about grain, model structure, assumptions, data quality, and how a downstream user might consume the outputs. This in turn would contribute to questions around efficiency. 

# Build

Extended a dbt project using DuckDB, created modular models, added tests and documentation, and explored how the outputs could be visualised in Lightdash via Docker. Grain, model structure, data quality, reusable business logic, and stakeholder-facing analytical outputs.

{{< loom id="232098d99d774e288ed5ca6749ea3c97" t="45" caption="Walkthrough of the build process" >}}

I approached the task as a fully scoped analytics engineering project rather than a one-off SQL exercise.

I reviewed the source data and existing staging models to understand available entities, their grains, and how they related to each other. Before writing any substantial transformations, I wanted to be clear about what each table represented and where ambiguity existed.

\[Add short code example: inspecting source models or dbt lineage\]

I structured the dbt project around a layered modelling approach

- Staging layer handled source cleanup and standardisation

- Intermediate and mart layers focused on reusable business logic

- The Mart layer would host final analytical outputs

```sql
/staging
> stg_test__test1.sql

/intermediate
> int_test__test2.sql

/marts
> fact_journey.sql
```

The key modelling decisions were around how to represent `journeys`, `stations`, `services`, and `delays`. I tried to avoid pushing too much business logic into a single final query. Instead, I separated reusable components into intermediate models so that the final marts were easier to read, test, and explain, e.g

```sql
select
    ...
from {{ ref('stg_...') }}
```

I added dbt tests where I thought they were useful. For a technical exercise, tests serve two purposes: they catch obvious mistakes, but they also show the reviewer how you think about data quality. I focused on uniqueness, not-null checks, accepted values, and relationship tests where appropriate.

```sql
models:
  - name: example_model
    columns:
      - name: example_id
        tests:
          - not_null
          - unique
```

For the analytical questions, I created specific models or queries that could answer each requirement directly, rather than leaving the answers buried inside ad hoc SQL. This made the outputs more reproducible and easier to validate.

```sql
[Add code example: analytical output model]
```

I also considered how the data would be consumed in a BI layer. Since Lightdash integrates naturally with dbt concepts, I thought about which models would make good explores, which dimensions and metrics would be useful, and how a user might slice railway performance by station, time period, route, or operator.

\[Add screenshot or example: Lightdash metric/dimension configuration\]

Optionally, I spun up Lightdash using Docker to demonstrate how the modelled data could be exposed to a BI tool. This was not strictly required, but I thought it was a useful way to show the final mile of the analytics workflow: not just transforming data, but making it usable.

```sql
[Add Docker Compose snippet]
```

## Decisions

One of the main decisions was to keep the transformations modular. In a small test, it is tempting to answer everything in a handful of large SQL files. That may be quicker initially, but it makes the logic harder to inspect and harder to reuse.

I also tried to be explicit about assumptions. Technical tests often contain data quirks or incomplete context, and there is rarely an opportunity to ask the same questions you would ask in a real project. In those cases, documenting assumptions is often as important as the implementation itself.

I treated DuckDB as more than just a convenient local database. It is a practical choice for this kind of assessment because it allows fast local development without needing cloud infrastructure. It also keeps the exercise focused on modelling and SQL rather than environment setup.

```sql
[Add short note or code example: dbt profile for DuckDB]
```

# Outcomes

I was rejected.

I found it odd not to be given the chance to present my work - to clarify anything. That’s something I’ll be more careful about in future. If a technical test requires several hours of work, I think there should be a review or at least a discussion attached. Otherwise, the process risks becoming too opaque: candidates invest time, submit work, and receive little meaningful feedback.

I lost out to another candidate who had more industry experience. That is fair enough; hiring processes are comparative, and there will always be stronger fits for a given team or moment. I had hoped the additional effort, including optionally spinning up Lightdash with Docker might count in my favour.

On the positive side, I did re learned more than I expected about railway data. I also left with the comfort of knowing I gave the exercise a serious attempt and produced something I was willing to share publicly.

# Reflections

On top of learning far more about railways than I care to admit, this experience reinforced a few points for me:

1. Technical tests should have a clear scope test

If the guidance is* ‘*a few hours’, the evaluation should reflect that. If the expectation is closer to a real project, that should be stated clearly.

2. Senior data roles increasingly combine several jobs 

From analytics engineer, to data modeller, from platform engineer to BI developer, and product thinker to stakeholder partner, another consequence of the AI-pocalypse is how … where otherwise are now able to contrintue in all fields. That may be reasonable in some organisations, but it should be reflected honestly in role description.

3. Candidates should be more deliberate about boundaries. 

I’m glad I completed the task properly, but it seems reasonable to ask upfront whether a submission will be discussed, how it will be assessed, and what level of polish is expected. I’ll be more selective about take-home tasks in the future. I am still happy to do take home tasks, not least to keep up with the changing technical landscape, and especially when it resembles the job itself, but I’d prefer assessments that include a conversation. The discussion is where the most useful signal appears: why trade-offs were made, what they would improve, and how they respond to feedback.

I did not get the role, but the exercise was useful. It gave me a chance to work through a realistic scenario, and an excuse to work with [#dbt](/shipj.com/blog/?tags=dbt), [#DuckDB](/shipj.com/blog/?tags=duckdb), [#docker](/shipj.com/blog/?tags=docker) and [#lightdash](/shipj.com/blog/?tags=lightdash).

The hunt continues.

---

# Predictions

{{< prediction id="3597fd6b-fd0d-80a1-8562-e859591309df" >}} 

{{< prediction id="3597fd6b-fd0d-8093-a336-d92b0ec18f03" >}}
