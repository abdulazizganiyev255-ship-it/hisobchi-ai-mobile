# HISOBCHI AI — S+ Expert Board, responsibilities & execution cards
**Status:** governance specification, not autonomous deployment.
**Board form:** GitHub issue checklist plus these versioned files (no GitHub Projects board claimed).
**Lifecycle:** BACKLOG → RESEARCH → UX-SPEC → CREATIVE → DESIGN-SPEC → BUILD → QA → REVIEW → ACCEPTED. Blocked items remain BLOCKED and cannot be counted as done.

## Expert council / agent charters
| Role / virtual worker | Skill requirements | Input | Output | Independent challenge |
|---|---|---|---|---|
| 01 Product Lead / Orchestrator | product strategy, trade-offs, priority | verified product constraints | brief, stage gates, scope | QA Lead |
| 02 User Researcher | JTBD, interview/survey quality, bias | problem statement, users | evidence, hypotheses and unanswered questions | Product Lead |
| 03 Information Architect | IA, navigation, mental models | screen inventory | task flow, state graph | UX Researcher |
| 04 Behavioral Finance Reviewer | language of real vs predicted money | financial semantics | trust and risk copy review | Security / data engineer |
| 05 Creative Director | typography, layout, conceptual originality | references and constraints | 3 original visual directions | UX + Accessibility |
| 06 Design System Architect | DTCG, semantic tokens, theme scales | selected concept | tokens and variant spec | Frontend Lead |
| 07 Interaction / Motion Designer | hierarchy, touch, microinteractions | flows and component specs | interactive state spec | Accessibility Lead |
| 08 Component Engineer | React Native, TypeScript, StyleSheet | approved tokens | small composable RN components | QA Engineer |
| 09 Data Visualization Specialist | chart semantics, scales, caveats | data provenance and chart goal | truthful accessible charts | Finance Reviewer |
| 10 Accessibility Lead | WCAG, TalkBack, VoiceOver, dynamic type | built screen + copy | contrast/target/reading-order report | QA Lead |
| 11 Test / Visual QA Lead | unit, contract, E2E, native screenshot | implementation and baseline | evidence-backed pass/fail | Product Lead |
| 12 Security & Performance Reviewer | threat model, Expo/native constraints | integrations, dependencies | hard-stop release review | independent review |

Each role is a **work mode**. In ChatGPT, it can be performed sequentially with explicit critic pass; no unsupported claim of 12 separate live agents. User approves final creative direction; reviewer vetoes P0/P1.

## Skills / procedures to create or reuse
`brief-intake`; `evidence-register`; `ux-task-flow`; `finance-truth-review`; `creative-reference-anatomy`; `visual-direction-ideation`; `semantic-token-engineer`; `component-contract-audit`; `motion-interaction-spec`; `accessibility-audit`; `visual-diff-qa`; `native-release-gate`; `decision-memory`; `independent-critic`.
Every skill requires a README with trigger, evidence prerequisites, refusal/stop conditions, output schema, test/checklist and handoff. A skill description is not a successful executed test.

## Work board / task cards
| ID | Priority | Card | Responsible | Depends on | Evidence / definition of done | Status |
|---|---|---|---|---|---|---|
| D00 | P0 | Audit repo branch, CI, known screen/component inventory | QA Lead | none | source links, matrix; untested items marked | DONE (source only) |
| D01 | P0 | Freeze product wording / financial truth map | Finance Reviewer | D00 | demo/actual/forecast distinctions and accepted copy | BACKLOG |
| D02 | P0 | Six-screen IA + critical flow/error states | IA | D01 | clickable flow spec and 6-state matrix | BACKLOG |
| D03 | P1 | Reference anatomy (not copying) + originality rules | Creative Director | D02 | 3 documented visual concepts | BACKLOG |
| D04 | P0 | Select creative direction and approve Home visual | Product Lead | D03 | human-reviewed target mockup | BLOCKED: target not chosen |
| D05 | P0 | Semantic design tokens + contrast audit | DS Architect | D04 | tested tokens; 4.5:1 normal text | BACKLOG |
| D06 | P0 | Components: buttons, typography, fields, cards, nav, overlays | Component Engineer | D05 | state stories and tests | BACKLOG |
| D07 | P0 | Home/Safe-to-Spend explanation prototype | UI Engineer | D06,D01 | correct demo disclosure and primary flow | BACKLOG |
| D08 | P0 | Add/edit expense, calendar, dynamic feedback | UI Engineer | D07 | CRUD and error path regression-free | BACKLOG |
| D09 | P1 | Activity / Analytics / visualizations | Data Viz Specialist | D08 | data-source consistent, screen-reader summary | BACKLOG |
| D10 | P1 | Profile / Onboarding / settings | UX Engineer | D09 | entry/exit/back behavior and empty/loading/error | BACKLOG |
| D11 | P0 | Responsive, native screenshots, screen-reader QA | QA / Accessibility | D07-D10 | 320/360/393, font 1.3x/2x, Android Back, keyboard | BACKLOG |
| D12 | P0 | Independent design + security approval / freeze | Critic / Reviewer | D11 | no critical defects; ADR; signoff | BACKLOG |

## How each work item is discussed and resolved
1. **Brief**: user's job and observable success; avoid aesthetic guesses.
2. **Evidence**: source code, screenshots, standards, fresh references; `ASSUMPTION` when unverified.
3. **Options**: one recommended option plus viable alternatives with trade-offs.
4. **Decision**: explicitly approve direction; record what stays fixed.
5. **Build**: one bounded change / component; separate PR; no main mutation.
6. **Review**: tests, screenshots, risk list; revert if regression.
7. **Archive**: update ADR and reusable skills only with validated learning.

## Fixed operating rules
- Preserve functional code until an approved replacement exists; UX redesign and finance-engine redesign are separate workstreams.
- No code that changes production financial data as part of UI design.
- Mobile first, tests before merge. Review each component before moving to next stage.
- Expose BLOCKED rather than implying unfinished tasks are done.
