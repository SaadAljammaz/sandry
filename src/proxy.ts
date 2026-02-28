import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role as string | undefined;

    // Redirect clients trying to access chef routes
    if (pathname.startsWith("/chef") && role !== "CHEF") {
      return NextResponse.redirect(new URL("/client/menu", req.url));
    }

    // Redirect chefs trying to access client routes
    if (pathname.startsWith("/client") && role !== "CLIENT") {
      return NextResponse.redirect(new URL("/chef/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/chef/:path*", "/client/:path*"],
};
