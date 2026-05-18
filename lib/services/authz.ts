import type { Role } from "@/prisma/generated/client"
import { getServerAuthSession } from "@/lib/auth"

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
  }
}

export async function requireSession(roles?: Role[]) {
  const session = await getServerAuthSession()

  if (!session?.user?.id || !session.user.role) {
    throw new HttpError(401, "Authentication required.")
  }

  if (roles && !roles.includes(session.user.role)) {
    throw new HttpError(403, "You do not have permission to perform this action.")
  }

  return session
}

export function jsonError(error: unknown) {
  if (error instanceof HttpError) {
    return Response.json({ ok: false, error: error.message }, { status: error.status })
  }

  if (error instanceof Error) {
    return Response.json({ ok: false, error: error.message }, { status: 400 })
  }

  return Response.json({ ok: false, error: "Unexpected error." }, { status: 500 })
}
