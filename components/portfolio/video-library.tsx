"use client";
import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Video } from "@/lib/content";
import posthog from "posthog-js";
const posthogConfigured = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
  process.env.NEXT_PUBLIC_POSTHOG_HOST,
);
function VideoThumbnail({ id }: { id: string }) {
  const [local, setLocal] = useState(true);
  return (
    <Image
      src={
        local
          ? `/videos/${id}.jpg`
          : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
      }
      alt=""
      width={480}
      height={270}
      sizes="(max-width: 760px) 100vw, 33vw"
      onError={() => setLocal(false)}
    />
  );
}
export function VideoLibrary({
  videos,
  viewsDate,
  featured = false,
}: {
  videos: Video[];
  viewsDate: string;
  featured?: boolean;
}) {
  const [category, setCategory] = useState("All videos");
  const [playing, setPlaying] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const visible = featured
    ? videos.slice(0, 3)
    : videos.filter(
        (v) => category === "All videos" || v.category === category,
      );
  return (
    <>
      {!featured ? (
        <div className="filters" role="group" aria-label="Filter videos">
          {[
            "All videos",
            "CEE & education",
            "Nursing conversations",
            "Brand content",
            "Student life",
          ].map((c) => (
            <button
              key={c}
              className={category === c ? "active" : ""}
              aria-pressed={category === c}
              onClick={() => {
                if (posthogConfigured)
                  posthog.capture("video_filter_selected", {
                    video_category: c,
                  });
                setCategory(c);
                setPlaying(null);
              }}
            >
              {category === c ? (
                <motion.span
                  layoutId="filter-pill"
                  className="filter-pill"
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 420, damping: 36 }
                  }
                />
              ) : null}
              <span className="filter-label">{c}</span>
            </button>
          ))}
        </div>
      ) : null}
      <div className="video-grid" data-stagger>
        <AnimatePresence initial={false} mode="popLayout">
        {visible.map((v) => (
          <motion.article
            key={v.id}
            className="video-card"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            layout={!reduce}
            transition={{
              duration: reduce ? 0 : 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="video-player">
              {playing === v.id ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`}
                  title={v.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <button
                  type="button"
                  className="video-poster"
                  onClick={() => {
                    if (posthogConfigured)
                      posthog.capture("video_playback_started", {
                        video_id: v.id,
                        video_category: v.category,
                      });
                    setPlaying(v.id);
                  }}
                  aria-label={`Play ${v.title}`}
                >
                  <VideoThumbnail id={v.id} />
                  <span className="play-circle" aria-hidden="true">
                    ▶
                  </span>
                  <span className="video-duration">{v.duration}</span>
                </button>
              )}
            </div>
            <div className="work-meta">
              <p className="eyebrow">{v.category}</p>
              <span>{v.views} views*</span>
            </div>
            <h3>{v.title}</h3>
            <p>{v.description}</p>
            <a
              className="video-external"
              href={`https://www.youtube.com/watch?v=${v.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch on YouTube ↗
            </a>
          </motion.article>
        ))}
        </AnimatePresence>
      </div>
      <p className="fineprint">
        *Views as of {viewsDate}. Videos play through YouTube’s privacy-enhanced
        player once you press play. <a href="/privacy">Privacy details</a>.
      </p>
    </>
  );
}
