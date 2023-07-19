import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    if (
      req.nextUrl.pathname.startsWith("/admin") ||
      req.nextUrl.pathname.startsWith("/api/admin")
    ) {
      if (req.nextauth.token?.role === "employee") {
        return NextResponse.rewrite(
          new URL("/auth/signin?error=AccessDenied", req.url)
        );
      }
    }
  },
  {
    pages: {
      signIn: "/auth/signin",
      error: "/auth/error",
    },
  }
);
