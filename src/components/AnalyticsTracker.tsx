"use client";

import { useEffect } from "react";
import type { Locale } from "@/i18n/config";

function readCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp("(^| )" + name + "=([^;]+)"),
  );
  return match ? decodeURIComponent(match[2]) : null;
}

export function AnalyticsTracker({ locale }: { locale: Locale }) {
  useEffect(() => {
    const visitorId = readCookie("rz_vid");
    const path = window.location.pathname;
    const referrer = document.referrer || "";
    const start = Date.now();
    let scrollMax = 0;

    const query = new URLSearchParams(window.location.search);

    // Registrar la vista
    fetch("/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        type: "view",
        visitorId,
        path,
        referrer,
        locale,
        utmSource: query.get("utm_source"),
        utmMedium: query.get("utm_medium"),
        utmCampaign: query.get("utm_campaign"),
      }),
    }).catch(() => {});

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      if (scrollable > 0) {
        const pct = (doc.scrollTop / scrollable) * 100;
        if (pct > scrollMax) scrollMax = pct;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const sendEngagement = () => {
      const payload = JSON.stringify({
        type: "engagement",
        visitorId,
        path,
        locale,
        referrer,
        dwellMs: Date.now() - start,
        scrollPct: scrollMax,
      });
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/track",
          new Blob([payload], { type: "application/json" }),
        );
      } else {
        fetch("/api/track", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") sendEngagement();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", sendEngagement);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", sendEngagement);
    };
  }, [locale]);

  return null;
}
