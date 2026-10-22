'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

/**
 * Silent looping video that only plays while it is on screen (saves bandwidth and battery). The still poster image
 * shows while the video loads and for visitors who prefer reduced motion.
 */
export function RoomVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = video.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="media-frame relative aspect-video rounded-none bg-ink">
      <Image src={poster} alt={label} fill quality={85} className="object-cover" sizes="(max-width: 1024px) 100vw, 480px" />
      <video
        ref={video}
        className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
      />
    </div>
  );
}
