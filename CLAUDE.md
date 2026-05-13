@AGENTS.md

# ShopSpace — Project Instructions

## What we're building
ShopSpace is a Zillow-like platform for renting empty retail spaces inside shopping centers in Spain (then EU). Three rental types: long-term lease, pop-up/event, and marketing placement. See memory for full product context.

## Skills to always use
- **lean**: Use the `lean` skill for all feature development tasks
- **security-review**: Use the `security-review` skill before any auth, data, or API work

## User context
- Dora is non-technical. Explain all technical concepts in plain English.
- Any manual step she must take herself: write it as a numbered list with exact copy-paste text.
- Never point her to a file to copy — paste the content directly in the response.
- Any code she needs to paste somewhere: include it in full, inline in the response.

## Tech stack decisions (never reverse these)
- Next.js 16, App Router, TypeScript
- `proxy.ts` not `middleware.ts` (Next.js 16 renamed it)
- shadcn/ui v4 uses base-ui, NOT Radix UI — `asChild` does NOT exist; use `render={<Component />}` on triggers
- Use `LinkButton` from `src/components/ui/link-button.tsx` for link-styled buttons
- Supabase for auth, database, and file storage
- next-intl for i18n — all UI text must exist in both `en.json` and `es.json`
- Mapbox GL JS for maps
- Resend for transactional email

## Code conventions
- All new UI text: add to both `src/messages/en.json` and `src/messages/es.json`
- Components go in `src/components/` organized by feature (layout, listings, map, search)
- Always run `npm run build` and confirm it passes before reporting a task done
- Commit every meaningful chunk of work to GitHub with a clear message
