"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

type VideoPlayerProps = {
  src: string;
  poster: string;
  title: string;
  playLabel?: string;
  className?: string;
  loop?: boolean;
};

/**
 * Reproductor con carga diferida: no descarga el video hasta que el usuario
 * pulsa play (los archivos son grandes). Muestra un poster y overlay elegante.
 */
export function VideoPlayer({
  src,
  poster,
  title,
  playLabel = "Reproducir",
  className = "",
  loop = false,
}: VideoPlayerProps) {
  const [active, setActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  function start() {
    setActive(true);
    requestAnimationFrame(() => {
      videoRef.current?.play().catch(() => {
        /* autoplay puede fallar; el usuario tiene controles */
      });
    });
  }

  return (
    <div
      className={`group relative aspect-video w-full overflow-hidden rounded-xl border border-zinc-800 bg-black ${className}`}
    >
      {active ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          controls
          loop={loop}
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        />
      ) : (
        <button
          type="button"
          onClick={start}
          aria-label={`${playLabel}: ${title}`}
          className="absolute inset-0 h-full w-full"
        >
          <Image
            src={poster}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-500/90 text-zinc-950 shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110">
              <Play className="ml-0.5 h-7 w-7 fill-current" />
            </span>
          </span>
          <span className="absolute bottom-4 left-4 right-4 text-left">
            <span className="line-clamp-2 text-sm font-medium text-white drop-shadow">
              {title}
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
