import { readdirSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import * as portfolio from "@/lib/portfolio";

// Content from the Supabase tables in supabase/content.sql, falling back to lib/portfolio.ts when
// Supabase is unreachable (e.g. the free project is paused) or the tables don't exist yet.
// Pages using it set `export const revalidate = 300` so edits appear within 5 minutes.

export type Stat = { value: string; label: string; period: string };
export type Platform = (typeof portfolio.platforms)[number];
export type CaseStudy = (typeof portfolio.caseStudies)[number] & {
  poster?: string;
};
export type Video = (typeof portfolio.videos)[number];
export type ShortVideo = (typeof portfolio.shortVideos)[number] & {
  poster?: string;
};
export type Content = {
  statsDate: string;
  videoViewsDate: string;
  mediaKitPdf?: string;
  stats: Stat[];
  platforms: Platform[];
  caseStudies: CaseStudy[];
  videos: Video[];
  shortVideos: ShortVideo[];
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// TikTok covers are files in public/videos/tiktok named after the video ID, e.g. 7636764523038297365.jpg.
const tiktokDir = path.join(process.cwd(), "public", "videos", "tiktok");
const imageFile = /\.(jpe?g|png|webp|avif)$/i;

function tiktokPosters() {
  let files: string[] = [];
  try {
    files = readdirSync(tiktokDir).filter((f) => imageFile.test(f));
  } catch {}
  return (id: string) => {
    const file = files.find((f) => path.parse(f).name === id);
    return file ? `/videos/tiktok/${file}` : undefined;
  };
}

function mediaUrl(file?: string | null) {
  if (!file || !supabaseUrl) return undefined;
  const encoded = file.split("/").map(encodeURIComponent).join("/");
  return `${supabaseUrl}/storage/v1/object/public/media/${encoded}`;
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kathmandu",
  }).format(new Date(iso));
}

const fallback = (
  tiktokPoster: (id: string) => string | undefined,
): Content => ({
  statsDate: portfolio.statsDate,
  videoViewsDate: portfolio.statsDate,
  stats: portfolio.stats.map(([value, label, period]) => ({
    value,
    label,
    period,
  })),
  platforms: portfolio.platforms,
  caseStudies: portfolio.caseStudies.map((c) => ({
    ...c,
    poster: c.tiktokId ? tiktokPoster(c.tiktokId) : undefined,
  })),
  videos: portfolio.videos,
  shortVideos: portfolio.shortVideos.map((v) => ({
    ...v,
    poster: tiktokPoster(v.id),
  })),
});

async function loadContent(): Promise<Content> {
  const tiktokPoster = tiktokPosters();
  if (!supabaseUrl || !supabaseKey) return fallback(tiktokPoster);
  const db = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    // A paused or slow project fails fast into the fallback instead of stalling page regeneration.
    global: {
      fetch: (input, init) => {
        const timeout = AbortSignal.timeout(5000);
        return fetch(input, {
          ...init,
          signal: init?.signal
            ? AbortSignal.any([init.signal, timeout])
            : timeout,
        });
      },
    },
  });
  const [settings, stats, platforms, caseStudies, videos, shortVideos] =
    await Promise.all([
      db
        .from("site_settings")
        .select("stats_date, media_kit_pdf, youtube_synced_at")
        .maybeSingle(),
      db.from("stats").select("value, label, period").order("sort_order"),
      db
        .from("platforms")
        .select(
          "name, handle, url, followers, highlight_value, highlight_label",
        )
        .order("sort_order"),
      db
        .from("case_studies")
        .select(
          "brand, platform, views, views_label, title, goal, made, tiktok_id, poster_path, links, quote_text, quote_by",
        )
        .order("sort_order"),
      db
        .from("videos")
        .select("id, title, category, duration, views, description")
        .order("sort_order"),
      db
        .from("short_videos")
        .select("id, title, views, note, poster_path")
        .order("sort_order"),
    ]);
  const failed = [
    settings,
    stats,
    platforms,
    caseStudies,
    videos,
    shortVideos,
  ].find((r) => r.error);
  if (failed?.error) {
    console.error(
      "Supabase content unavailable, using lib/portfolio.ts:",
      failed.error.message,
    );
    return fallback(tiktokPoster);
  }

  const statsDate = settings.data?.stats_date ?? portfolio.statsDate;
  return {
    statsDate,
    videoViewsDate: settings.data?.youtube_synced_at
      ? formatDate(settings.data.youtube_synced_at)
      : statsDate,
    mediaKitPdf: mediaUrl(settings.data?.media_kit_pdf),
    stats: stats.data ?? [],
    platforms: (platforms.data ?? []).map((p) => ({
      name: p.name,
      handle: p.handle,
      url: p.url,
      followers: p.followers ?? undefined,
      highlight:
        p.highlight_value && p.highlight_label
          ? ([p.highlight_value, p.highlight_label] as [string, string])
          : undefined,
    })),
    caseStudies: [
      ...(caseStudies.data ?? []).map((c) => ({
        brand: c.brand,
        platform: c.platform,
        views: c.views,
        viewsLabel: c.views_label,
        title: c.title,
        goal: c.goal,
        made: c.made,
        tiktokId: c.tiktok_id ?? undefined,
        poster:
          mediaUrl(c.poster_path) ??
          (c.tiktok_id ? tiktokPoster(c.tiktok_id) : undefined),
        links: Array.isArray(c.links) ? c.links : [],
        quote: c.quote_text
          ? { text: c.quote_text, by: c.quote_by ?? "" }
          : undefined,
      })),
      // Keep this new collaboration visible until it is also added to Supabase.
      ...portfolio.caseStudies
        .filter(
          (local) =>
            local.brand === "Smart Educational Academy" &&
            !(caseStudies.data ?? []).some(
              (stored) => stored.brand === local.brand,
            ),
        )
        .map((local) => ({ ...local, poster: undefined })),
    ],
    videos: videos.data ?? [],
    shortVideos: (shortVideos.data ?? []).map((v) => ({
      id: v.id,
      title: v.title,
      views: v.views,
      note: v.note,
      poster: mediaUrl(v.poster_path) ?? tiktokPoster(v.id),
    })),
  };
}

export const getContent = cache(loadContent);
