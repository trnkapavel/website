# CONTEXT.md — Handoff notes (paveltrnka.com)

Working notes for continuing this project on another machine. Not documentation — a snapshot of what's in flight.

## Where things stand (2026-07-14)

- **Cloudflare Worker (AI Audit backend) is live and working.** Deployed at `https://ai-audit-worker.trnkapavel.workers.dev`. `cloudflare/ai-audit/src/index.ts` system prompt and tool descriptions are now fully in English (translated from Czech). Auth (`wrangler login`), KV namespace (`RATE_LIMIT`, id `09103eb1adbe4f14860f63dc6d4094d0`), and all 3 secrets (`ANTHROPIC_API_KEY`, `TURNSTILE_SECRET_KEY`, `HMAC_SECRET`) are configured on Cloudflare's side (not in git, nothing to redo on a new machine unless redeploying secrets).
- **Critical bug fixed**: `tool_choice` was `{type: 'auto'}`, which let the model respond with plain text instead of calling `ask_followup`/`finalize_audit`, causing persistent `502 upstream_error`. Fixed to `{type: 'any'}` for non-final turns. This was the root cause of most of the debugging in the previous session.
- **CORS**: `wrangler.toml`'s `ALLOWED_ORIGIN` is `"https://trnka.website,http://localhost:4321"` (multi-origin, resolved via `resolveOrigin()` in `index.ts`). Open decision: strip `localhost:4321` before going fully "production-clean," or keep it for future local dev — not decided.
- **Frontend wired up**: `AiAudit.astro` has real values now — `WORKER_URL = 'https://ai-audit-worker.trnkapavel.workers.dev'`, `TURNSTILE_SITE_KEY = '0x4AAAAAAD1H8v8YafPn18Nb'` (Turnstile widget's domain allowlist includes `localhost` for dev testing). Leftover Czech button-loading strings (`'Analyzuju…'`, `'Spustit audit →'`) were found and translated to English.
- **New: real visual progress bar** added to `AiAudit.astro` (3-step: Describe → Follow-up → Result), wired into the existing `setStage()` state machine, using existing design tokens. Confirmed working live by the user ("Ano, perfektní").
- `astro.config.mjs` `site` is now `'https://trnka.website'` (was a placeholder).
- Debug `console.error(...)` logging was added throughout `index.ts`'s error branches during troubleshooting and **was never removed**. Not a security issue (no secrets logged), just noise — decide later whether to trim.
- **Live-verification status**: the `ask_followup` (follow-up question) stage has been confirmed working end-to-end in the browser. The final `finalize_audit` **result screen** (before/after comparison UI) has NOT yet been visually confirmed — worth testing through to completion next.
- Cost check: user reported ~$0.04 spent on Anthropic API during a day of testing — cheap, not a concern.

## Blocking issue for deployment: GitHub Actions secrets are NOT configured

Checked via `gh api repos/trnkapavel/website/actions/secrets` — **zero secrets exist** in the repo. `.github/workflows/deploy.yml` (FTP deploy on push to `main`, via `SamKirkland/FTP-Deploy-Action@v4.3.5`) requires:
- `FTP_SERVER`
- `FTP_USERNAME`
- `FTP_PASSWORD`
- `FTP_SERVER_DIR` (deliberately a secret, not hardcoded — needed to target a subdirectory so this deploy doesn't overwrite the existing `/ai-digest/` AI Briefing project living on the same `trnka.website` host)

Until these are set (GitHub repo Settings → Secrets and variables → Actions), pushing to `main` will build successfully but the FTP deploy step will fail. **Do this before relying on push-to-deploy.**

## Local-only directories (gitignored, won't be on the second machine via git)

`.claude/`, `.serena/`, `.agents/`, `skills-lock.json` are gitignored — local tool state, re-populates itself, nothing to carry over.

`cloudflare/ai-audit/node_modules/` and `.wrangler/` are gitignored. Run `npm install` inside `cloudflare/ai-audit/` on the new machine before touching the worker. `.dev.vars` (holds `ANTHROPIC_API_KEY`, `TURNSTILE_SECRET_KEY` for local `wrangler dev`) is gitignored and was never committed — recreate locally if resuming worker dev. Deployed secrets on Cloudflare's side are already live and don't need to be redone.

## Workflow reminders

- Content editing: Keystatic admin at `http://127.0.0.1:4321/keystatic`, only works with `npm run dev` running. New "Writing" entries need the **Excerpt** field filled or the build fails.
- After CSS/markup changes: `npx astro build` to catch errors, then check visually in the browser (claude-in-chrome MCP).
- Worker changes: `cd cloudflare/ai-audit && wrangler deploy` to push live; `wrangler tail` to stream logs for debugging.
- Design iteration preference: go in small steps on subtle effects (textures, opacity) — easy to overshoot into "too busy." Paired elements (photo + contact, icon + text) should sit side by side, not stacked.

## Not yet resolved / open

- GitHub Actions FTP secrets missing (see blocking issue above) — biggest open item.
- Decide whether to strip debug `console.error` logging from `index.ts`, and whether to keep `localhost:4321` in `ALLOWED_ORIGIN` long-term.
- Full live test through to the `finalize_audit` result screen hasn't been visually confirmed yet.
- Local changes (worker translation/fix, CORS, frontend wiring, progress bar) are committed in this session's push — check `git log` on the new machine to confirm they landed.
