import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { creatorWebsiteSchema } from "@/lib/creator-website-schema";
import { creatorWebsiteLaunchActive } from "@/lib/creator-website-offer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const privateHeaders = { "Cache-Control": "no-store" };
const reply = (body: unknown, status: number) =>
  Response.json(body, { status, headers: privateHeaders });

export async function POST(request: Request) {
  // This endpoint accepts lead requests, NOT payments or confirmed orders.
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return reply({ error: "Submit the form from this website." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return reply({ error: "Unsupported request." }, 415);
  if (Number(request.headers.get("content-length") || 0) > 8000)
    return reply({ error: "Request too large." }, 413);

  const raw = await request.text();
  if (raw.length > 8000) return reply({ error: "Request too large." }, 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return reply({ error: "Invalid request." }, 400);
  }
  if (!body || typeof body !== "object" || Array.isArray(body))
    return reply({ error: "Invalid request." }, 400);

  const submitted = body as Record<string, unknown>;
  // Honeypot stops basic form bots. Production abuse may require CAPTCHA/rate limits.
  if (submitted.hpCheck) return reply({ error: "Invalid request." }, 400);

  const result = creatorWebsiteSchema.safeParse(submitted);
  if (!result.success)
    return reply({ error: result.error.issues[0]?.message || "Check your details." }, 400);

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    console.error("Creator leads: Supabase public configuration missing");
    return reply({ error: "The inquiry form is temporarily unavailable. Please DM me on Instagram." }, 503);
  }

  const id = crypto.randomUUID();
  const supabase = createClient(await cookies());
  const { error } = await supabase.from("creator_website_leads").insert({
    id,
    name: result.data.name,
    email: result.data.email,
    creator_handle: result.data.handle,
    creator_type: result.data.creatorType,
    work_url: result.data.workUrl,
    notes: result.data.notes,
    consent: result.data.consent,
    offer_at_inquiry: creatorWebsiteLaunchActive() ? "dashain_launch" : "standard",
  });

  if (error) {
    // Never return raw database errors or applicant details to the browser/logs.
    console.error("Creator leads insert failed:", error.code);
    return reply({
      error: "Could not save your request. Please try again or DM me on Instagram.",
    }, 503);
  }

  // The Supabase trigger sends the Gmail/Resend owner alert after commit.
  return reply({
    id,
    message: "Your request was received. This is not a confirmed booking or a reserved promotional slot.",
  }, 201);
}

export function GET() { return reply({ error: "Not available." }, 405); }
export function PATCH() { return reply({ error: "Not available." }, 405); }
export function DELETE() { return reply({ error: "Not available." }, 405); }
