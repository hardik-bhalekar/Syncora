import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/lib/auth";
import { jsonError } from "@/lib/services/authz";

export async function POST(request: Request) {
  try {
    const session = await getServerAuthSession();
    const body = await request.json();
    const { name, domain, plan } = body;

    if (!name) {
      return Response.json(
        { ok: false, error: "Organization name is required." },
        { status: 400 }
      );
    }

    const cleanDomain = domain ? domain.trim().toLowerCase() : null;

    // Check if an organization with this domain already exists
    let org;
    if (cleanDomain) {
      const existing = await prisma.organization.findUnique({
        where: { domain: cleanDomain },
      });
      if (existing) {
        org = existing;
      }
    }

    // If not found, create a new organization
    if (!org) {
      org = await prisma.organization.create({
        data: {
          name: name.trim(),
          domain: cleanDomain || null,
          plan: plan || "ENTERPRISE",
        },
      });
    }

    // If user is authenticated, update their tenantId
    if (session?.user?.id) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { tenantId: org.id },
      });
    }

    return Response.json({ ok: true, data: org });
  } catch (error) {
    return jsonError(error);
  }
}
