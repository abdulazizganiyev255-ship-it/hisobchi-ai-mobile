# Hisobchi AI Mobile — Repository Instructions

## Scope and hierarchy

These rules apply to this repository. Follow direct user instructions first, then these project rules, then broader user-level defaults. Keep universal guidance outside this file and project-specific guidance here.

Before changing anything, confirm the repository root, active branch, working-tree state, requested outcome, allowed scope, and required evidence. Preserve existing user work and approved decisions. Create or switch branches only when the user or task requests it; do not merge, force-push, rewrite history, or discard unrelated changes unless explicitly authorized.

## Project map and sources of truth

This is an Expo SDK 58 / React Native 0.88 / TypeScript UI prototype.

- `index.ts`: Expo entry point that registers `App.tsx`.
- `App.tsx`: application shell and local four-tab navigation.
- `src/screens/`: dashboard and prototype secondary screens.
- `src/components/`: shared icons, chart, and transaction row; `.web.tsx` files are web-specific implementations.
- `src/data/demo.ts`: deterministic demo-only financial data and UZS formatting.
- `src/theme/tokens.ts`: shared color, spacing, radius, and shadow tokens.
- `README.md`: supported workflow, prototype limits, and acceptance checks.
- `docs/01-dizayn-tizimi.md`: current design hierarchy and visual QA guidance.
- `package.json` and `package-lock.json`: commands and dependency versions.
- `app.json`: Expo application identity and platform configuration.

When sources disagree, follow their authority order where it is clear. Stop and report only unresolved conflicts that materially affect the requested outcome, safety, or scope; continue unaffected safe work.

## Product and financial safety

- Treat every balance, transaction, chart, budget, and safe-to-spend value as demo data unless a separately approved task introduces verified production data.
- Never present the prototype as financial advice or a production-ready financial product.
- Do not add credentials, customer data, production Supabase access, bank connectivity, authentication, AI calls, or network integrations without explicit authorization and an approved security design.
- Real financial calculations must be deterministic, specified, boundary-tested, and reviewed before appearing as user guidance.
- Keep secrets out of source, logs, screenshots, fixtures, and Expo public variables.

## Implementation workflow

1. Trace the affected flow and reuse existing patterns before adding abstractions or dependencies.
2. Keep the change limited to the task contract; avoid opportunistic redesigns and unrelated cleanup.
3. Prefer shared tokens and platform-neutral logic. Keep native and web behavior aligned when platform files differ.
4. Preserve Uzbek product copy and the visible demo-state disclosure unless copy changes are explicitly in scope.
5. For defects, reproduce first, identify the root cause, implement the smallest durable fix, and add the narrowest regression check that would have caught it.
6. Record assumptions and distinguish verified facts from hypotheses. If a prerequisite is unavailable, continue safe independent work and report the exact blocker.

## Verification

Use the checks relevant to the change; never report an unrun check as passing.

```sh
npm ci
npm run typecheck
npm run check
```

Report every required check as `PASS`, `FAIL`, `BLOCKED`, or `NOT RUN`, with the command or evidence. A zero-test run is not test coverage. Dependency, native bundle, emulator, device, and production integration claims require their own evidence.

For UI changes, also verify:

- 360dp and 393dp widths;
- Android font scale 1.0x, 1.2x, and 1.5x;
- long UZS values, scrolling, bottom navigation, and interactive states;
- screen-reader labels, focus order, contrast, and practical touch targets;
- native and web rendering when both platforms are affected;
- loading, empty, error, and offline states when the changed flow supports real data.

Store or link visual evidence when visual acceptance is part of the task. Do not claim visual parity from source inspection alone.

## Change protection

- Do not modify application behavior, financial logic, dependencies, lockfiles, generated native projects, or production systems unless the task explicitly includes them.
- Do not edit protected or unrelated files merely to make checks pass.
- Before handoff, inspect `git diff`, confirm the working tree contains only intended changes, and list unavailable verification separately.
