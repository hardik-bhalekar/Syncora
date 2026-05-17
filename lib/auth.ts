import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
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

				if (!user) {
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
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id
				token.role = user.role
			}

			return token
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id ?? ""
				session.user.role = token.role ?? "EMPLOYEE"
			}

			return session
		},
	},
}

export async function getServerAuthSession() {
	const { getServerSession } = await import("next-auth")

	return getServerSession(authOptions)
}
