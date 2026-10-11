// Only public submission operations are forwarded; identity headers are never trusted.
export const INQUIRY_BACKEND =
  "https://namrata-dahal-creator.satinypearl4.chatgpt.site";
export const privateHeaders = { "Cache-Control": "no-store" };
export function reply(data: unknown, status = 200) {
  return Response.json(data, { status, headers: privateHeaders });
}
export async function forwardInquiry(
  path: "/api/inquiries" | "/api/inquiries/token",
  body?: string,
) {
  try {
    const r = await fetch(`${INQUIRY_BACKEND}${path}`, {
      method: body === undefined ? "GET" : "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: INQUIRY_BACKEND,
        Referer: `${INQUIRY_BACKEND}/collaborate`,
        "User-Agent": "Mozilla/5.0 NamrataPortfolio/1.0",
      },
      body,
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(15000),
    });
    return reply(await r.json(), r.status);
  } catch {
    return reply(
      {
        error:
          "The form is temporarily unavailable. Please retry or contact Namrata on Instagram.",
      },
      503,
    );
  }
}
