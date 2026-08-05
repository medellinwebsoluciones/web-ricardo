import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "./i18n/config";

const PUBLIC_FILE = /\.(.*)$/;
const VISITOR_COOKIE = "rz_vid";

function pickLocale(req: NextRequest): string {
  const header = req.headers.get("accept-language") || "";
  const preferred = header.split(",")[0]?.split("-")[0]?.toLowerCase();
  if (preferred && (locales as readonly string[]).includes(preferred)) {
    return preferred;
  }
  return defaultLocale;
}

function generateId(): string {
  // Edge-safe UUID
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip internals, api and static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/favicon.ico" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const hasLocale = locales.some(
    (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`),
  );

  let response: NextResponse;

  if (!hasLocale) {
    const locale = pickLocale(req);
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    response = NextResponse.redirect(url);
  } else {
    response = NextResponse.next();
  }

  // First-party visitor id for analytics
  if (!req.cookies.get(VISITOR_COOKIE)) {
    response.cookies.set(VISITOR_COOKIE, generateId(), {
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
