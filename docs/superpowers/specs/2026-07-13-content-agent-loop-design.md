# Content Agent Loop — Design

Status: design agreed, not yet implemented.

## Goal

A standalone Python tool (outside Claude Code, calls the Anthropic API directly) that generates the missing content for this website — case studies, About, hero copy, Writing articles — which are currently placeholder text.

## Scope decision

One piece of content per run (e.g. `python content_agent.py --type case-study --project "..."`), not a full backlog runner. This gives a review checkpoint after every piece and keeps failures easy to localize.

## Flow (4 steps)

1. **Planner** (`claude-sonnet-5`) — generates a structured content plan matching the Keystatic schema for the given content type.
2. **Plan checker** (`claude-haiku-4-5`) — strictly validates the plan; retry loop until it passes.
3. **Writer** (`claude-sonnet-5`) — turns the approved plan into the final `.mdoc` file: English, no diacritics, includes the required **Excerpt** field.
4. **Output checker** (`claude-haiku-4-5`) — validates the final file against schema, tone, and language; retry loop until it passes.

Output is written directly into `src/content/work/` or `src/content/writing/`, ready for review in Keystatic.

## Models

Opus is not used for now (explicit decision, 2026-07-12). Planner/Writer use Sonnet 5, both checkers use Haiku 4.5 — same split as the reference script this design is based on.

## Notes

- Follows the project's lean-process preference: no Claude Code subagent overhead, direct implementation once approved.
- Not yet built: no code exists for this tool yet.
