/**
 * src/lib/routes.config.ts
 *
 * Single registry describing every crawlable route on Fileinator.
 * `sitemap.ts` (and, if needed, `robots.ts`) read from this file so that
 * adding a new tool is a ONE-LINE change — no need to touch the sitemap
 * or robots implementation itself.
 *
 * Conventions:
 *  - `path`   : route path relative to the domain root, no trailing slash
 *               (except "/" for the homepage).
 *  - `changeFrequency` / `priority` follow the sitemap.xml protocol
 *    (https://www.sitemaps.org/protocol.html).
 *  - `lastModified` is optional per-entry; when omitted, the sitemap
 *    falls back to the build-time date. Set it explicitly whenever a
 *    page's content actually changes so search engines can pick up on it.
 */

import type { MetadataRoute } from "next";

export type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"];

export interface RouteEntry {
  path: string;
  changeFrequency: ChangeFrequency;
  priority: number;
  lastModified?: Date;
}

/* -------------------------------------------------------------------- */
/*  Core / static pages                                                  */
/* -------------------------------------------------------------------- */

export const staticRoutes: RouteEntry[] = [
  { path: "/", changeFrequency: "daily", priority: 1.0 },
  { path: "/tools", changeFrequency: "daily", priority: 0.9 }, // Browse Tools
  { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.5 },
  { path: "/terms-and-conditions", changeFrequency: "yearly", priority: 0.5 },
  { path: "/cookie-policy", changeFrequency: "yearly", priority: 0.5 },
];

/* -------------------------------------------------------------------- */
/*  Tool categories (e.g. /tools/image, /tools/pdf)                     */
/* -------------------------------------------------------------------- */

export const categoryRoutes: RouteEntry[] = [];

/* -------------------------------------------------------------------- */
/*  Individual tool pages                                                */
/* -------------------------------------------------------------------- */
/*
 * TODO: This list is intentionally seeded with the current Fileinator
 * catalogue as an example. In a real repo, replace this static array by
 * importing your actual tool registry (e.g. the config that powers your
 * /tools/[category]/[slug] dynamic routes), so this file and the routing
 * layer never drift apart:
 *
 *   import { allTools } from "@/config/tools";
 *   export const toolRoutes: RouteEntry[] = allTools.map((tool) => ({
 *     path: `/tools/${tool.category}/${tool.slug}`,
 *     changeFrequency: "weekly",
 *     priority: 0.9,
 *   }));
 */

export const toolRoutes: RouteEntry[] = [
  // Image tools
  { path: "/tools/image/compress", changeFrequency: "weekly", priority: 0.9 },
  { path: "/tools/image/convert", changeFrequency: "weekly", priority: 0.9 },
  { path: "/tools/image/crop", changeFrequency: "weekly", priority: 0.9 },
  { path: "/tools/image/resize", changeFrequency: "weekly", priority: 0.9 },
  { path: "/tools/image/rotate", changeFrequency: "weekly", priority: 0.9 },

  // PDF tools
  { path: "/tools/pdf/compress", changeFrequency: "weekly", priority: 0.9 },
  { path: "/tools/pdf/image-to-pdf", changeFrequency: "weekly", priority: 0.9 },
  { path: "/tools/pdf/merge", changeFrequency: "weekly", priority: 0.9 },
  { path: "/tools/pdf/pdf-to-image", changeFrequency: "weekly", priority: 0.9 },
  { path: "/tools/pdf/split", changeFrequency: "weekly", priority: 0.9 },
  { path: "/tools/pdf/unlock", changeFrequency: "weekly", priority: 0.9 },
  { path: "/tools/pdf/word-to-pdf", changeFrequency: "weekly", priority: 0.9 },

  // Audio tools
  { path: "/tools/audio/compress-audio", changeFrequency: "weekly", priority: 0.9 },
  { path: "/tools/audio/convert-audio", changeFrequency: "weekly", priority: 0.9 },
  { path: "/tools/audio/trim-audio", changeFrequency: "weekly", priority: 0.9 },
  { path: "/tools/audio/merge-audio", changeFrequency: "weekly", priority: 0.9 },
  { path: "/tools/audio/extract-audio", changeFrequency: "weekly", priority: 0.9 },

  // AI tools
  { path: "/tools/ai/background-remover", changeFrequency: "weekly", priority: 0.9 },
];

/* -------------------------------------------------------------------- */
/*  Aggregate export                                                     */
/* -------------------------------------------------------------------- */

export const allRoutes: RouteEntry[] = [
  ...staticRoutes,
  ...categoryRoutes,
  ...toolRoutes,
];

/* -------------------------------------------------------------------- */
/*  Paths that must NEVER be crawled / indexed                           */
/* -------------------------------------------------------------------- */

export const disallowedPaths: string[] = [
  "/api/",
  "/admin/",
  "/_private/",
  "/tmp/",
];
