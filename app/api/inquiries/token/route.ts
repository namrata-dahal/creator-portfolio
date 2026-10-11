export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const token =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  return Response.json(
    { token },
    { status: 200, headers: { "Cache-Control": "no-store" } },
  );
}
