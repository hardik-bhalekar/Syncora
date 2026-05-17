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

    if (!canAccessDashboard(token.role, pathname)) {
      return NextResponse.redirect(new URL(getDashboardHomePath(token.role), request.url))
    }

    return NextResponse.next()
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
  matcher: ["/dashboard/:path*"],
}