This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Google Reviews (5-star only)

The testimonials section currently uses a manual import (no API key required).

- Source file: `docs/review.txt`
- Generated data: `src/data/manualGoogleReviews.json`
- Regenerate JSON from the txt file: `node scripts/extract-manual-reviews.mjs`

Only reviewer-written text is included (owner responses are excluded), and only 5-star reviews are shown.

Optional: there is also a server route `/api/google-reviews` for fetching from Google Places if you want to switch back to API-based reviews.

Set these environment variables:

- `GOOGLE_MAPS_API_KEY` (required)
- `GOOGLE_PLACE_ID` (recommended) — Google Places `place_id` for the business

Optional (only if you don’t set `GOOGLE_PLACE_ID`):

- `GOOGLE_PLACE_QUERY` (default: `Maestrocareer Nagpur`)
- `GOOGLE_PLACE_LOCATION_BIAS` (default is biased to the coordinates from the shared Maps link)
- `GOOGLE_PLACE_REVIEWS_SORT` (default: `most_relevant`)

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
