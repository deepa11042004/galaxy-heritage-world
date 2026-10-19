'use client';

import React, { useState } from 'react';
import { Play } from 'lucide-react';

/** Shows a YouTube thumbnail; plays the video inline (no page change) once clicked. */
export function YouTubeEmbed({ videoId, title }: { videoId: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="media-frame relative aspect-video w-full rounded-xl">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play ${title}`}
          className="group/video absolute inset-0 block h-full w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt={`${title} thumbnail`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/video:scale-105"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-black/20">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-ink shadow-lg">
              <Play className="h-6 w-6 fill-ink" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
