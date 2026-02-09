import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Test - Entrar a /backstage/test en el navegador y DEBE redirigir al login
  if (pathname === "/backstage/test") {
    const url = req.nextUrl.clone();
    url.pathname = "/backstage/login";
    return NextResponse.redirect(url);
  }

  // Solo proteger /backstage (excepto /backstage/login)
  const isBackstage = pathname === "/backstage" || pathname.startsWith("/backstage/");
  const isLogin = pathname === "/backstage/login";

  if (!isBackstage || isLogin) {
    return NextResponse.next();
  }

  // Cookie simple de "sesión"
  const adminCookie = req.cookies.get("admin_session")?.value;

  // Si existe y vale "1", deja pasar
  if (adminCookie === "1") {
    return NextResponse.next();
  }

  // Si no hay cookie, redirige al login
  const url = req.nextUrl.clone();
  url.pathname = "/backstage/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/backstage/:path*"],
};
