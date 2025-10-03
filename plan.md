# Ship AI Agents — 30‑Day Action Plan

Last updated: 2025‑10‑01

## Goals & Guardrails
- Differentiate as “IDE‑ready AI Safety Rules,” not a prompt list.
- Ship weekly, measure everything, and bias to low‑JS, fast UX.
- Keep a11y and security (CSP, headers) first‑class.

## Success Metrics (Leading → Lagging)
- Activation: % sessions that open an agent modal ≥1 (target 35%).
- Rule usage: Copy/Download rate on Prompt/Rules tabs (target 20%).
- Return rate: 7‑day return users (target 12%).
- Sharing: % sessions with Share Link (target 8%).
- Community: # published rule sets/week (target 10 after week 3).

## Roadmap Overview
- Now (Days 1–3): Quick product + perf wins; URL‑driven state; downloads.
- Next (Days 4–7): Rule Composer MVP; analytics; SEO + CSP.
- Week 2: Community Templates + lightweight auth.
- Week 3: Validation tools + polish; pricing experiments (optional).

---

## Now — Days 1–3
1) Reduce bundle, improve UX
- Convert `app/page.tsx` to a server component; keep `FilterTabs` and `AgentModal` as client islands.
- Replace global hidden scrollbars; restore native scrollbars.
- Switch clickable `div` to semantic `button`/`a` for cards; add focus rings and `aria-label`s.

2) State via URL + Deep Links
- Support `?cat=` filter, `?q=` search, and `#agent-id` to open modal on load.
- Update URL on interactions without full reload.

3) Theming
- Adopt `next-themes` for FOUC‑free dark mode; remove manual DOM toggling.

4) Download & Share
- “Download Rules” with correct filename via `getIdeFilename()`.
- Stable share links for each agent.

Acceptance criteria
- Lighthouse Performance ≥ 90 on desktop; no hydration warnings.
- Opening `/#agent-id` renders modal focused on close button.
- Download produces `.cursorrules`/`CLAUDE.md` with correct content.

---

## Next — Days 4–7
1) Rule Composer MVP
- UI to pick IDE, stack, and risk posture (basic/moderate/strict).
- Generate merged rules via templates in `lib/ruleTemplates.ts`.

2) Analytics events (Plausible or Vercel Analytics custom events)
- `filter_change`, `search`, `agent_open`, `copy_prompt`, `copy_rules`, `download_rules`, `share_link`.

3) SEO + Safety
- OG/Twitter cards per agent; sitemap + robots.
- Strict CSP and security headers in `next.config.ts`.

Acceptance criteria
- Events visible with counts; share cards render with title/description/icon.
- CSP allows feedback widget and blocks inline eval.

---

## Week 2 — Community Templates + Auth
- CRUD for rule sets (JSON/SQLite). Submit, upvote, fork.
- Auth: GitHub or email magic link only.
- Moderation flag + simple admin view.

Acceptance criteria
- Create/edit/fork flows work; each rule set has a shareable URL.
- Abuse‑resistant basics: rate limits + minimal validation.

---

## Week 3 — Validation + Polish (and optional Pro)
- “Test my rules” dry‑run: paste commands → flag destructive patterns.
- Quality pass: keyboard traps, reduced motion, small‑screen tweaks.
- Optional: paywall for advanced packs or org spaces.

Acceptance criteria
- Validator catches rm -rf, force push, and overwrite patterns.
- All interactive elements reachable and operable via keyboard.

---

## Engineering Checklist (By File)
- `app/page.tsx`: server component; read `searchParams`; pass props to client islands; incremental data loading.
- `components/AgentCard.tsx`: root `button` with `type="button"`, `aria-label`, visible focus, small hover.
- `components/AgentModal.tsx`: respects `#agent-id`; updates hash on open/close; adds `Download`.
- `components/FilterTabs.tsx`: uses URL params; no global state coupling.
- `components/DarkModeToggle.tsx`: use `next-themes`’s `useTheme()`; remove manual attribute logic.
- `lib/agents.ts`: compute category counts from `agents`; avoid shipping large icon map to client.
- `lib/ruleTemplates.ts`: expose `renderRules(agentId, ide, options)`; add presets for risk posture.
- `next.config.ts`: add `headers()` with CSP, Referrer‑Policy, Permissions‑Policy.
- `app/layout.tsx`: rich `metadata` (OG/Twitter), preload critical fonts, keep analytics script allowlisted by CSP.
- `app/globals.css`: remove global scrollbar hiding; preserve focus styles.

---

## Analytics Spec (Event → props)
- `filter_change` → `{ cat }`
- `search` → `{ q_len }`
- `agent_open` → `{ id }`
- `copy_prompt` / `copy_rules` / `download_rules` → `{ id, ide }`
- `share_link` → `{ id }`

---

## Risks & Mitigations
- Vendor scripts blocked by CSP → pre‑audit sources, add nonces.
- Bundle creep from icons/data → server render icons; lazy import client maps.
- Community abuse → rate limit, minimal moderation, report button.

## Out of Scope (for 30 days)
- Full text editor or IDE plugins.
- Complex billing system.

## Next Step
Implement “Now — Days 1–3” tasks behind small PR‑sized commits. 
