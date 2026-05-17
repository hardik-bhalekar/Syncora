import { redirect } from "next/navigation"
import { getServerAuthSession } from "@/lib/auth"
import { getDashboardHomePath } from "@/lib/rbac"

export default async function DashboardIndexPage() {
  const session = await getServerAuthSession()

  if (!session?.user?.role) {
    redirect("/login")
  }

  redirect(getDashboardHomePath(session.user.role))
}