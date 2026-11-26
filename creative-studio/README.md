# Creative Studio

A single-page creative agency foundation built with the Next.js App Router, TypeScript, and Tailwind CSS. The current homepage is a design-system preview; production sections are intentionally out of scope for this phase.

## Getting started

```bash
npm run dev
```

## Project structure

- `app/` contains the root layout, homepage, and global styles.
- `src/components/providers/` contains the client-only smooth-scroll provider.
- `src/config/site.ts` holds the editable temporary brand name and tagline.
- `src/lib/gsap.ts` registers and exports GSAP, ScrollTrigger, and `useGSAP`.

## Validation

```bash
npx tsc --noEmit
npm run lint
npm run build
```
