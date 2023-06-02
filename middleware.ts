import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    if (req.nextUrl.pathname.startsWith("/admin")) {
      console.log("You are logged in as", req.nextauth.token?.role);
      if (req.nextauth.token?.role !== "admin") {
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
