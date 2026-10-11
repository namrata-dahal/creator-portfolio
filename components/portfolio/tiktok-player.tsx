"use client";
import { useState } from "react";
import Image from "next/image";
import posthog from "posthog-js";
const posthogConfigured = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
  process.env.NEXT_PUBLIC_POSTHOG_HOST,
);
export function TikTokPlayer({
  id,
  title,
  views,
  poster,
  brand,
}: {
  id: string;
  title: string;
  views?: string;
  poster?: string;
  brand?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const showPoster = poster && !posterFailed;
  return (
    <div className="short-player">
      {playing ? (
        <iframe
          src={`https://www.tiktok.com/player/v1/${id}?autoplay=1&rel=0&description=0&music_info=0`}
          title={title}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button
          type="button"
          className={showPoster ? "has-poster" : undefined}
          onClick={() => {
            if (posthogConfigured)
              posthog.capture("short_video_playback_started", {
                video_id: id,
                ...(brand ? { brand } : {}),
              });
            setPlaying(true);
          }}
          aria-label={`Play ${title}`}
        >
          {showPoster ? (
            <Image
              src={poster}
              alt=""
              fill
              sizes="(max-width: 760px) 70vw, 280px"
              onError={() => setPosterFailed(true)}
            />
          ) : null}
          <span className="play-circle" aria-hidden="true">
            ▶
          </span>
          {views ? (
            <>
              <strong data-count>{views}</strong>
              <small>views on TikTok</small>
            </>
          ) : (
            <small>Play on TikTok</small>
          )}
        </button>
      )}
    </div>
  );
}
