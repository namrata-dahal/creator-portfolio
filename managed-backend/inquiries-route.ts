import { and, eq, gte, desc, count } from "drizzle-orm";
import { getDb } from "@/db";
import { inquiries } from "@/db/schema";
import { inquirySchema } from "@/lib/inquiry-schema";
import {
  isInquiryOwner,
  verifyFormToken,
  sameOrigin,
  privateHeaders,
} from "@/lib/inquiry-server";
function reply(data: unknown, status = 200) {
  return Response.json(data, { status, headers: privateHeaders });
}
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return reply({ error: "Please submit the form from this website." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return reply({ error: "Unsupported request." }, 415);
  if (Number(request.headers.get("content-length") || 0) > 20000)
    return reply({ error: "The request is too large." }, 413);
  try {
    const text = await request.text();
    if (text.length > 20000)
      return reply({ error: "The request is too large." }, 413);
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      return reply({ error: "Invalid request." }, 400);
    }
    if (!body || typeof body !== "object" || body.companyFax)
      return reply({ error: "Unable to accept this request." }, 400);
    const id =
      typeof body.token === "string" ? await verifyFormToken(body.token) : null;
    if (!id)
      return reply(
        {
          error:
            "Your form session expired. Please refresh the page and try again.",
        },
        403,
      );
    const result = inquirySchema.safeParse(body);
    if (!result.success)
      return reply(
        { error: result.error.issues[0]?.message || "Please check the form." },
        400,
      );
    const data = result.data,
      db = getDb();
    const existing = await db
      .select({ id: inquiries.id })
      .from(inquiries)
      .where(eq(inquiries.id, id))
      .limit(1);
    if (existing.length)
      return reply({ id, message: "Your request has already been received." });
    const [recent] = await db
      .select({ total: count() })
      .from(inquiries)
      .where(
        and(
          eq(inquiries.email, data.email),
          gte(inquiries.createdAt, Date.now() - 3600000),
        ),
      );
    if (recent.total >= 3)
      return reply(
        {
          error:
            "Several requests have already been received from this email. Please try again in an hour.",
        },
        429,
      );
    await db
      .insert(inquiries)
      .values({
        id,
        name: data.name,
        email: data.email,
        brand: data.brand,
        website: data.website,
        objective: data.objective,
        format: data.format,
        budget: data.budget,
        platforms: JSON.stringify(data.platforms),
        timeline: data.timeline,
        usage: data.usage,
        details: data.details,
        createdAt: Date.now(),
      })
      .onConflictDoNothing();
    return reply(
      {
        id,
        message:
          "Your request has been saved to Namrata’s private inquiry inbox.",
      },
      201,
    );
  } catch {
    return reply(
      {
        error:
          "Your request could not be saved. Please try again. You can also contact Namrata on Instagram.",
      },
      503,
    );
  }
}
export async function GET() {
  if (!(await isInquiryOwner()))
    return reply({ error: "Owner access required." }, 403);
  try {
    return reply({
      inquiries: await getDb()
        .select()
        .from(inquiries)
        .orderBy(desc(inquiries.createdAt))
        .limit(200),
    });
  } catch {
    return reply({ error: "Could not load inquiries." }, 503);
  }
}
export async function PATCH(request: Request) {
  if (!sameOrigin(request) || !(await isInquiryOwner()))
    return reply({ error: "Owner access required." }, 403);
  try {
    const body = (await request.json()) as { id?: string; status?: string };
    if (
      !body.id ||
      typeof body.id !== "string" ||
      ![
        "new",
        "reviewing",
        "replied",
        "booked",
        "declined",
        "archived",
      ].includes(body.status || "")
    )
      return reply({ error: "Invalid update." }, 400);
    await getDb()
      .update(inquiries)
      .set({ status: body.status! })
      .where(eq(inquiries.id, body.id));
    return reply({ ok: true });
  } catch {
    return reply({ error: "Update failed." }, 503);
  }
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request) || !(await isInquiryOwner()))
    return reply({ error: "Owner access required." }, 403);
  try {
    const body = (await request.json()) as { id?: string };
    if (typeof body.id !== "string")
      return reply({ error: "Invalid request." }, 400);
    await getDb().delete(inquiries).where(eq(inquiries.id, body.id));
    return reply({ ok: true });
  } catch {
    return reply({ error: "Deletion failed." }, 503);
  }
}
