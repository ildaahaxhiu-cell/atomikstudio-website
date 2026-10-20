# Atomik Studio

Website for Atomik Studio. Next.js 16 (App Router), Sanity for content, GSAP + Lenis for scroll motion.

## Run

```bash
pnpm install
pnpm dev        # http://localhost:3030
pnpm build
```

## Pages

| Route | What it is |
| --- | --- |
| `/` | Giant wordmark that shrinks into the nav, statement, stacked project cards, index, services rail |
| `/work` | Filters by discipline, draggable image rows, or an index with cursor previews |
| `/work/[slug]` | Case study: title, facts, cover that opens to full bleed, paired images, credits, next project |
| `/studio` | About, how we work, services, clients, Tirana clock |
| `/contact` | Enquiry form (sent via Resend), email, location |
| `/admin` | Sanity Studio for editing projects and site settings |

## Content

Without `NEXT_PUBLIC_SANITY_PROJECT_ID` the site runs on the sample content in `lib/seed.ts`, which uses typographic placeholders instead of images. Once Sanity is connected, projects and site settings come from there; any setting left empty falls back to the sample.

To connect Sanity: create a project at sanity.io/manage, add the project ID to `.env.local` and Vercel, and add `http://localhost:3030` plus the live domain as CORS origins (with credentials).

## Contact form

Set `RESEND_API_KEY`, `ENQUIRY_TO` and `ENQUIRY_FROM` (a sender on a domain verified in Resend). Until then the form tells visitors it is not connected and shows the email address.

## Motion

All scroll effects live in `components/` and use `gsap.matchMedia`, so they switch off for `prefers-reduced-motion` and the pinned or sticky effects switch off on small screens.
