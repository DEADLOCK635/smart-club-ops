import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, ADMIN_TOKEN } from "@/lib/auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authed = request.cookies.get(ADMIN_COOKIE)?.value === ADMIN_TOKEN;

  if (pathname === "/admin/login" || pathname === "/ops/login") {
    if (authed) return NextResponse.redirect(new URL("/ops", request.url));
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/ops")) {
    if (!authed) {
      const url = new URL("/ops/login", request.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/ops/:path*", "/ops"],
};

