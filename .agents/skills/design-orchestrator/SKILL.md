---
name: design-orchestrator
description: Coordinate Hisobchi AI design planning, specialists, evidence and stage gates; use before any cross-screen redesign or design system change.
---
# Design Orchestrator
## Trigger
A new UI request changes multiple components, stages or product areas.
## Inputs
Target branch and commit, user goal, existing constraints, screenshots if available, current issue board and source audit.
## Procedure
1. Identify task, measurable user outcome, and known limitations. Do not ask for facts already provided.
2. Read `docs/design-os-splus/00_MASTER_ROADMAP.md` and existing screen inventory.
3. Separate VERIFIED_SOURCE, CI_VERIFIED, VISUALLY_VERIFIED, DEVICE_VERIFIED, ASSUMPTION and NOT_TESTED.
4. Assign work modes: researcher → UX architect → creative director → component engineer → accessibility and QA. Do not impersonate completed independent tests.
5. Enforce dependency ordering: real financial semantics → flow → visual target → tokens → components → screens → QA.
6. Make one bounded draft PR per implementation slice; preserve old behavior until replacement passes tests.
7. Record decision, changed files, tests executed, failed gates, next work card.
## Output
Brief, source links, owner/critic assignments, Dxx card IDs, acceptance criteria, blocked items and rollback.
## STOP
Block if financial meaning is unknown, visual target is unapproved, or work risks changing Supabase/ledger without authorization. Never call a mockup production-ready.
