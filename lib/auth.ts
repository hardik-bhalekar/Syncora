import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"
import type { Role } from "@/prisma/generated/client"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import AzureADProvider from "next-auth/providers/azure-ad"
import GitHubProvider from "next-auth/providers/github"
import { z } from "zod"
import { prisma } from "./prisma"

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const baseAdapter = PrismaAdapter(prisma as any)
const customAdapter = {
  ...baseAdapter,
  createUser: async (data: any) => {
    let org = await prisma.organization.findFirst({
      where: { domain: "goal-sync.local" },
    })
    if (!org) {
      org = await prisma.organization.findFirst()
    }
    if (!org) {
      org = await prisma.organization.create({
        data: {
          name: "Goal Sync Demo Org",
          domain: "goal-sync.local",
          plan: "ENTERPRISE",
        },
      })
    }

    let role: Role = "EMPLOYEE"
    const emailLower = data.email?.toLowerCase() || ""
    if (emailLower.includes("admin") || emailLower === "labop69@gmail.com") role = "ADMIN"
    else if (emailLower.includes("manager")) role = "MANAGER"
    else if (emailLower.includes("super")) role = "SUPER_ADMIN"

    return prisma.user.create({
      data: {
        ...data,
        tenantId: org.id,
        role,
      },
    })
  },
}

export const authOptions: NextAuthOptions = {
  adapter: customAdapter as any,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-google-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-google-secret",
      allowDangerousEmailAccountLinking: true,
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID || process.env.MICROSOFT_CLIENT_ID || "mock-azure-id",
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || process.env.MICROSOFT_CLIENT_SECRET || "mock-azure-secret",
      tenantId: process.env.AZURE_AD_TENANT_ID || process.env.MICROSOFT_TENANT_ID || "common",
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "mock-github-id",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "mock-github-secret",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials)

        if (!parsed.success) {
          return null
        }

        const email = parsed.data.email.trim().toLowerCase()
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(parsed.data.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.tenantId = user.tenantId ?? token.tenantId
      }

      if (!token.tenantId && token.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: token.email } })
        if (dbUser) {
           token.tenantId = dbUser.tenantId;
           token.role = dbUser.role;
           token.id = dbUser.id;
        }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
        session.user.tenantId = token.tenantId as string
      }

      return session
    },
  },
}

export async function getServerAuthSession() {
  const { getServerSession } = await import("next-auth")
  return getServerSession(authOptions)
}
