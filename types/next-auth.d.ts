import type { Role } from "@prisma/client"
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string
      role: Role
      tenantId: string
    }
  }

  interface User {
    role?: Role
    tenantId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    role?: Role
    tenantId?: string
  }
}
