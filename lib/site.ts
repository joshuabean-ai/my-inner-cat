/**
 * Canonical site origin, used for metadata, share URLs, sitemap, and robots.
 * Set NEXT_PUBLIC_SITE_URL in the environment (e.g. on Vercel) to override —
 * preview deploys can point at their own URL, production at the live domain.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://myinnercat.com"
).replace(/\/$/, "");
