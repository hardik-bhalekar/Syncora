import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"
import type { Role } from "@prisma/client"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import AzureADProvider from "next-auth/providers/azure-ad"
import { z } from "zod"
import { prisma } from "./prisma"

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-client-secret",
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID || "mock-azure-id",
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || "mock-azure-secret",
      tenantId: process.env.AZURE_AD_TENANT_ID || "common",
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
