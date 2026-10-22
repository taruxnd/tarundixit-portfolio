/** jsDelivr CDN for repo `public/` assets (edge-cached). */
export const ASSET_CDN =
  "https://cdn.jsdelivr.net/gh/taruxnd/tarundixit-portfolio@main/public";

/** Map a site-root public path (`/work/...`) to its CDN URL. */
export function assetUrl(path: string): string {
  const clean = path.replace(/^\/+/, "");
  // Locally, read straight from public/ so new assets show before they are pushed.
  if (process.env.NODE_ENV === "development") return `/${clean}`;
  return `${ASSET_CDN}/${clean}`;
}
