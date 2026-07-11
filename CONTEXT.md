# CONTEXT.md — Handoff notes (paveltrnka.com)

Working notes for continuing this project on another machine. Not documentation — a snapshot of what's in flight.

## Where things stand

- Site language: **fully English now.** The last Czech content (an article on AI agents/planning loops) was translated and moved to `src/content/writing/how-to-build-an-ai-agent-with-planning-loops-a-complete-guide.mdoc` (old Czech-slug file removed). UI strings in `AiAudit.astro`, `TableOfContents.astro`, `MoreWriting.astro` were also translated. A repo-wide grep for Czech diacritics in `src/` should stay clean going forward — re-run before publishing anything new:
  ```
  grep -rlP '[ěščřžýáíéůúďťňĚŠČŘŽÝÁÍÉŮÚĎŤŇ]' src --include="*.astro" --include="*.json" --include="*.mdoc" --include="*.ts" --include="*.mjs"
  ```
- Homepage restructuring from the AI Audit plan (see `/Users/paveltrnka/.claude/plans/eventual-soaring-wilkes.md`) is **largely implemented**: AI Audit section now sits right under the hero (`data-spy="02"`, no watermark), "Selected work" is now "Proof" and reordered, `SectionRail.astro` and `404.astro` updated accordingly, `content.config.ts` has the optional `aiWorkflow` schema field. The conversational/agentic-loop rewrite is also in place: `cloudflare/ai-audit/src/index.ts` implements the `messages[]`-based loop with `ask_followup`/`finalize_audit` tool use, and `AiAudit.astro`'s frontend JS handles the multi-turn `type === 'question'` / `type === 'final'` flow.
  - **Known gap, needs fixing before this is truly English end-to-end**: the worker's system prompt in `cloudflare/ai-audit/src/index.ts` (instructions + few-shot examples sent to the LLM) is still **in Czech** (~35 lines with diacritics). Since this prompt drives the language the AI responds in, an English-language site with a Czech-language backend prompt is inconsistent — translate this next.
  - `AiAudit.astro`'s `WORKER_URL` and `TURNSTILE_SITE_KEY` are still placeholders — worker isn't deployed yet.
- Hero CTA fixed: primary CTA now scrolls to `#ai-audit` ("Try the AI audit ↓") styled as a real filled button (`--ink` bg / `--paper` text, matches `.cta-button` in `AiAudit.astro`); "See how I work" demoted to the quiet secondary link.
- Fixed a real bug: the article sidebar (`TableOfContents.astro` + `MoreWriting.astro` on `/writing/[slug]/`) used to visually overlap during scroll because only `.toc` had `position: sticky` while `.more-writing` scrolled normally as a sibling. Fixed by making the whole `<aside class="sidebar">` sticky as one unit instead (see `src/pages/writing/[slug].astro`).
- Fixed code blocks in articles: added Shiki syntax highlighting (`markdoc.config.mjs`, theme `github-light`), terminal-style chrome (dots + language label) matching the homepage AI Audit terminal, and line-wrapping (`white-space: pre-wrap; overflow-wrap: anywhere;`) so long lines don't get clipped.
- Added heading `id` slugification via a custom Markdoc `heading` node override in `markdoc.config.mjs` (uses `src/lib/slugify.mjs`), needed for the TOC's anchor links.

## Local-only directories (gitignored, won't be on the second machine via git)

`.claude/`, `.serena/`, `.agents/`, `skills-lock.json` were added to `.gitignore` — these are local tool state (Claude Code, Serena MCP, agent skills), not site source. On a second machine, these tools will re-populate their own local state as needed; nothing to carry over manually.

`cloudflare/ai-audit/node_modules/` and `.wrangler/` are gitignored as usual. Run `npm install` inside `cloudflare/ai-audit/` on the new machine before touching the worker. `.dev.vars` (holds `ANTHROPIC_API_KEY`, `TURNSTILE_SECRET_KEY` for local `wrangler dev`) is also gitignored and was never committed — you'll need to recreate it locally if you resume worker development.

## Workflow reminders

- Content editing: Keystatic admin at `http://127.0.0.1:4321/keystatic`, only works with `npm run dev` running. New "Writing" entries need the **Excerpt** field filled or the build fails.
- After CSS/markup changes: `npx astro build` to catch errors, then check visually in the browser (claude-in-chrome MCP, when connected — it was disconnected for a large stretch of the previous session, forcing verification via `curl`/`grep` on built HTML instead).
- Design iteration preference: go in small steps on subtle effects (textures, opacity) — easy to overshoot into "too busy." Paired elements (photo + contact, icon + text) should sit side by side, not stacked.

## Not yet resolved / open

- `close-SKILL.md` at the repo root is a stray untracked file (unrelated Memophant skill definition), never committed, left alone pending a decision to delete it.
- The AI Audit agentic-loop rewrite (frontend conversational flow + worker tool-use loop + HMAC signing + Turnstile invisible mode) from the plan is the largest remaining chunk of work — see the plan file for the full spec.
