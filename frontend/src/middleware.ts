import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;
  
  console.log(request.nextUrl.pathname);
  if (pathname == "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const publicPaths = ["/login", "/register"];

  if (!token && pathname.startsWith("/task")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/task", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/task/:path*",
    "/login",
    "/register",
  ],
};
