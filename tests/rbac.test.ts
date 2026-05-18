import assert from "node:assert/strict"
import test from "node:test"
import { getDashboardHomePath, getDashboardNavItems, canAccessDashboard } from "@/lib/rbac"

test("RBAC: resolves correct dashboard home path per role", () => {
  assert.equal(getDashboardHomePath("SUPER_ADMIN"), "/dashboard/admin")
  assert.equal(getDashboardHomePath("ADMIN"), "/dashboard/admin")
  assert.equal(getDashboardHomePath("MANAGER"), "/dashboard/manager")
  assert.equal(getDashboardHomePath("EMPLOYEE"), "/dashboard/employee")
  assert.equal(getDashboardHomePath(null), "/login")
  assert.equal(getDashboardHomePath(undefined), "/login")
})

test("RBAC: returns appropriate navigation items based on role hierarchy", () => {
  const adminNav = getDashboardNavItems("ADMIN")
  assert.equal(adminNav.length, 4)
  assert.equal(adminNav[0].href, "/dashboard/admin")

  const managerNav = getDashboardNavItems("MANAGER")
  assert.equal(managerNav.length, 3)
  assert.equal(managerNav[0].href, "/dashboard/manager")

  const employeeNav = getDashboardNavItems("EMPLOYEE")
  assert.equal(employeeNav.length, 2)
  assert.equal(employeeNav[0].href, "/dashboard/employee")
})

test("RBAC: enforces strict path access permissions", () => {
  // ADMIN access
  assert.equal(canAccessDashboard("ADMIN", "/dashboard/admin"), true)
  assert.equal(canAccessDashboard("ADMIN", "/dashboard/manager"), true)
  assert.equal(canAccessDashboard("ADMIN", "/dashboard/employee"), true)

  // MANAGER access
  assert.equal(canAccessDashboard("MANAGER", "/dashboard/admin"), false)
  assert.equal(canAccessDashboard("MANAGER", "/dashboard/manager"), true)
  assert.equal(canAccessDashboard("MANAGER", "/dashboard/employee"), true)
  assert.equal(canAccessDashboard("MANAGER", "/dashboard/analytics"), true)

  // EMPLOYEE access
  assert.equal(canAccessDashboard("EMPLOYEE", "/dashboard/admin"), false)
  assert.equal(canAccessDashboard("EMPLOYEE", "/dashboard/manager"), false)
  assert.equal(canAccessDashboard("EMPLOYEE", "/dashboard/employee"), true)
  assert.equal(canAccessDashboard("EMPLOYEE", "/dashboard/analytics"), true)

  // Unauthenticated / Invalid role
  assert.equal(canAccessDashboard(null, "/dashboard/employee"), false)
})
