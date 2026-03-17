import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("session")?.value;

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/mail")) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const sessionRes = await fetch(
        new URL("/api/auth/session", request.url),
        {
          headers: { Cookie: `session=${sessionToken}` },
        }
      );
      const data = await sessionRes.json();

      if (!data.user) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.set("session", "", { maxAge: 0, path: "/" });
        return response;
      }

      if ((pathname.startsWith("/admin") || pathname.startsWith("/mail")) && !data.user.isAdmin) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/mail/:path*"],
};
