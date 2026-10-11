import { inquirySchema } from "@/lib/inquiry-schema";
import { sendInquiryConfirmation } from "@/lib/inquiry-email";
import { createClient } from "@/utils/supabase/server";
import { flushPostHogLogs, posthogInquiryLogger } from "@/instrumentation";
import { SeverityNumber } from "@opentelemetry/api-logs";
import { after } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return Response.json(
      { error: "Please submit the form from this website." },
      { status: 403, headers: { "Cache-Control": "no-store" } },
    );
  if (!request.headers.get("content-type")?.includes("application/json"))
    return Response.json(
      { error: "Unsupported request." },
      { status: 415, headers: { "Cache-Control": "no-store" } },
    );
  if (Number(request.headers.get("content-length") || 0) > 20000)
    return Response.json(
      { error: "The request is too large." },
      { status: 413, headers: { "Cache-Control": "no-store" } },
    );
  const text = await request.text();
  if (text.length > 20000)
    return Response.json(
      { error: "The request is too large." },
      { status: 413, headers: { "Cache-Control": "no-store" } },
    );
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    return Response.json(
      { error: "Invalid request." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }
  if (
    !body ||
    typeof body !== "object" ||
    body.hpCheck ||
    typeof body.token !== "string" ||
    body.token.length > 150
  )
    return Response.json(
      { error: "Invalid request." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  const result = inquirySchema.safeParse(body);
  if (!result.success)
    return Response.json(
      { error: result.error.issues[0]?.message || "Please check the form." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Public visitors may insert but not read rows, so the id is generated here instead of returned by the insert.
  const id = crypto.randomUUID();
  const { error } = await supabase.from("inquiries").insert({
    id,
    name: result.data.name,
    email: result.data.email,
    brand: result.data.brand,
    website: result.data.website,
    objective: result.data.objective,
    format: result.data.format,
    budget: result.data.budget,
    platforms: result.data.platforms,
    timeline: result.data.timeline,
    usage: result.data.usage,
    details: result.data.details,
    consent: result.data.consent,
  });

  if (error) {
    console.error("Supabase error:", error);
    return Response.json(
      { error: "Could not save your request. Please try again." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }

  posthogInquiryLogger?.emit({
    body: "Collaboration inquiry persisted",
    severityNumber: SeverityNumber.INFO,
    attributes: { route: "/api/inquiries", outcome: "persisted" },
  });

  const { confirmationSent } = await sendInquiryConfirmation(result.data, id);
  posthogInquiryLogger?.emit({
    body: "Collaboration inquiry notification processing completed",
    severityNumber: SeverityNumber.INFO,
    attributes: {
      route: "/api/inquiries",
      confirmation_sent: confirmationSent,
    },
  });
  after(flushPostHogLogs);

  return Response.json(
    { id, confirmationSent },
    { status: 200, headers: { "Cache-Control": "no-store" } },
  );
}
export async function GET() {
  return Response.json(
    { error: "Not available." },
    { status: 403, headers: { "Cache-Control": "no-store" } },
  );
}
export async function PATCH() {
  return Response.json(
    { error: "Owner access required." },
    { status: 403, headers: { "Cache-Control": "no-store" } },
  );
}
export async function DELETE() {
  return Response.json(
    { error: "Owner access required." },
    { status: 403, headers: { "Cache-Control": "no-store" } },
  );
}
