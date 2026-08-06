"use client";

import { useState } from "react";
import Image from "next/image";

type ArchMapProps = {
  title: string;
  archImage: string;
  archInteractive?: string;
  architectureLabel: string;
  interactiveHint?: string;
};

/**
 * Mapa de arquitectura: iframe interactivo (HTML) con fallback a PNG.
 */
export function ArchMap({
  title,
  archImage,
  archInteractive,
  architectureLabel,
  interactiveHint = "Interactivo · pasa el cursor por cada capa",
}: ArchMapProps) {
  const [failed, setFailed] = useState(false);
  const useIframe = Boolean(archInteractive) && !failed;

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
      {useIframe ? (
        <>
          <div className="flex items-center justify-between gap-3 border-b border-zinc-800/80 px-4 py-2.5">
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-400/90">
              {architectureLabel}
            </span>
            <span className="text-[11px] text-zinc-500">{interactiveHint}</span>
          </div>
          <div className="relative aspect-[16/10] w-full bg-[#050506]">
            <iframe
              title={`${architectureLabel}: ${title}`}
              src={archInteractive}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              sandbox="allow-scripts"
              referrerPolicy="no-referrer"
              onError={() => setFailed(true)}
            />
          </div>
        </>
      ) : (
        <Image
          src={archImage}
          alt={`${architectureLabel}: ${title}`}
          width={1280}
          height={800}
          className="h-auto w-full"
        />
      )}
    </div>
  );
}
