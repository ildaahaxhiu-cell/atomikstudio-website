# Atomik Studio

Website for Atomik Studio. Next.js 16 (App Router), GSAP + Lenis for scroll motion. Content lives in the repo.

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

## Content

Everything is in `lib/data.ts`: projects (name, sector, services, copy, credits, images) and site settings (email, statement, services, clients, how we work).

Projects without images show typographic placeholders. To add real images, put them in `public/work/<slug>/` and swap the project's `placeholders(...)` for `images('<slug>', [['01.jpg', 1600, 900, 'Alt text'], ...])`. The first image is the cover; wide images run full width on the case study and tall ones are paired.

## Contact form

Set `RESEND_API_KEY`, `ENQUIRY_TO` and `ENQUIRY_FROM` (a sender on a domain verified in Resend). Until then the form tells visitors it is not connected and shows the email address.

## Motion

All scroll effects live in `components/` and use `gsap.matchMedia`, so they switch off for `prefers-reduced-motion` and the pinned or sticky effects switch off on small screens.

## Content editor (`/admin`)

Edit projects, images and site text at `/admin`, styled like the site. Publish commits `content/site.json` and any new images to GitHub in one commit; Vercel then rebuilds the site (about a minute).

Vercel environment variables:

- `ADMIN_PASSWORD`: the editor password (8+ characters).
- `GITHUB_TOKEN`: a fine-grained GitHub token for this repository only, with **Contents: Read and write**.
- Optional: `GITHUB_REPO` (default `ildaahaxhiu-cell/atomikstudio-website`), `GITHUB_BRANCH` (default `main`).

Locally, set `ADMIN_PASSWORD` in `.env.local`; without `GITHUB_TOKEN` the editor writes to the files on disk.
