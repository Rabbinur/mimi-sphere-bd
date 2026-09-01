import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const tokenCookie = request.cookies.get("accessToken");
  const refreshTokenCookie = request.cookies.get("refreshToken");
  let accessToken = tokenCookie?.value;
  const refreshToken = refreshTokenCookie?.value;

  const redirectToLogin = () => {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete({ name: "accessToken", path: "/" });
    res.cookies.delete({ name: "refreshToken", path: "/" });
    return res;
  };

  let userRole: string | null = null;

  // 1. Local JWT Validation (Non-blocking)
  if (accessToken) {
    try {
      const decoded: any = jwtDecode(accessToken);
      const isExpired = decoded.exp * 1000 < Date.now();
      if (!isExpired) {
        userRole = decoded.role;
      }
    } catch (error) {
      // Invalid token
    }
  }

  const isUserAccount = pathname.startsWith("/user-account");

  if (isUserAccount && !userRole && !refreshToken) {
    return redirectToLogin();
  }

  if (userRole) {
    if (userRole === "ADMIN" && isUserAccount) {
      return NextResponse.next();
    }
  }

  if (pathname === "/login" && userRole === "USER") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user-account/:path*"],
};
