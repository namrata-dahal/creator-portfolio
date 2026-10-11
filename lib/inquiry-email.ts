import type { InquiryInput } from "@/lib/inquiry-schema";
import { contact } from "@/lib/portfolio";
const esc = (v: string) =>
  v.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
async function send(payload: Record<string, unknown>) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8000),
  });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${await r.text()}`);
}
// The owner alert is sent by the Supabase trigger in supabase/notify-new-inquiry.sql.
// The brand confirmation needs INQUIRY_FROM_EMAIL on a domain verified in Resend; Resend's shared test sender can only email the account owner.
export async function sendInquiryConfirmation(d: InquiryInput, id: string) {
  const key = process.env.RESEND_API_KEY,
    owner = process.env.INQUIRY_NOTIFY_EMAIL,
    from = process.env.INQUIRY_FROM_EMAIL;
  if (!key || !from) return { confirmationSent: false };
  const rows: [string, string][] = [
    ["Brand", d.brand],
    ["Name", d.name],
    ["Email", d.email],
    ["Website", d.website || "—"],
    ["Goal", d.objective],
    ["Format", d.format],
    ["Platforms", d.platforms.join(", ")],
    ["Budget", d.budget],
    ["Timing", d.timeline],
    ["Usage", d.usage],
    ["Reference", id],
  ];
  const table = `<table cellpadding="6" style="border-collapse:collapse">${rows.map(([k, v]) => `<tr><td style="color:#5a645a">${k}</td><td><strong>${esc(v)}</strong></td></tr>`).join("")}</table>`;
  try {
    await send({
      from,
      to: [d.email],
      ...(owner ? { reply_to: owner } : {}),
      subject: "I’ve received your collaboration request — Namrata Dahal",
      html: `<p>Hi ${esc(d.name.split(" ")[0])},</p><p>Thank you for reaching out about a collaboration with ${esc(d.brand)}. Your request is with me, and I’ll reply ${contact.responseTime}.</p><p>Here’s a copy of what you sent:</p>${table}<p style="white-space:pre-wrap">${esc(d.details)}</p><p>This confirms I’ve received your request; it isn’t a booking yet. We’ll agree the scope, timing and fee together.</p><p>Namrata</p>`,
      text: `Hi ${d.name.split(" ")[0]},\n\nThank you for reaching out about a collaboration with ${d.brand}. Your request is with me, and I’ll reply ${contact.responseTime}.\n\nReference: ${id}\n\nNamrata`,
    });
    return { confirmationSent: true };
  } catch (error) {
    console.error("Inquiry confirmation email failed:", error);
    return { confirmationSent: false };
  }
}
