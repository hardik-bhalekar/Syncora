import type { Role } from "@/prisma/generated/client"

export type DashboardNavItem = {
  href: string
  label: string
}

export function getDashboardHomePath(role?: Role | null) {
  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return "/dashboard/admin"
    case "MANAGER":
      return "/dashboard/manager"
    case "EMPLOYEE":
      return "/dashboard/employee"
    default:
      return "/login"
  }
}

export function getDashboardNavItems(role?: Role | null): DashboardNavItem[] {
  if (role === "SUPER_ADMIN" || role === "ADMIN") {
    return [
      { href: "/dashboard/admin", label: "Admin" },
      { href: "/dashboard/manager", label: "Manager" },
      { href: "/dashboard/employee", label: "Employee" },
      { href: "/dashboard/analytics", label: "Analytics" },
    ]
  }

  if (role === "MANAGER") {
    return [
      { href: "/dashboard/manager", label: "Manager" },
      { href: "/dashboard/employee", label: "Employee" },
      { href: "/dashboard/analytics", label: "Analytics" },
    ]
  }

  return [
    { href: "/dashboard/employee", label: "Employee" },
    { href: "/dashboard/analytics", label: "Analytics" },
  ]
}

export function canAccessDashboard(role: Role | null | undefined, pathname: string) {
  if (role === "SUPER_ADMIN" || role === "ADMIN") {
    return true
  }

  if (role === "MANAGER") {
    return pathname.startsWith("/dashboard/manager") || pathname.startsWith("/dashboard/employee") || pathname.startsWith("/dashboard/analytics")
  }

  if (role === "EMPLOYEE") {
    return pathname.startsWith("/dashboard/employee") || pathname.startsWith("/dashboard/analytics")
  }

  return false
}