import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { canAccessDashboard, getDashboardHomePath } from "@/lib/rbac"

export default withAuth(
  function middleware(request) {
    const token = request.nextauth.token
    const pathname = request.nextUrl.pathname

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Enterprise RBAC and Tenancy checks
    // The token now carries the tenantId for the user
    const tenantId = token.tenantId as string | undefined;

    if (!tenantId && pathname.startsWith("/dashboard")) {
      // If a user doesn't belong to a tenant, they shouldn't access tenant workspaces
      return NextResponse.redirect(new URL("/onboarding/organization", request.url));
    }

    if (!canAccessDashboard(token.role, pathname)) {
      return NextResponse.redirect(new URL(getDashboardHomePath(token.role), request.url))
    }

    // Inject tenantId into headers for downstream API routes to consume natively
    const requestHeaders = new Headers(request.headers);
    if (tenantId) {
      requestHeaders.set('x-tenant-id', tenantId);
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      }
    });
  },
  {
    callbacks: {
      authorized: ({ token }) => Boolean(token),
    },
    pages: {
      signIn: "/login",
    },
  }
)

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
}