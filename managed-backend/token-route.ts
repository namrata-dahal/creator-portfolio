import { makeFormToken, privateHeaders } from "@/lib/inquiry-server";
export async function GET() {
  try {
    return Response.json(
      { token: await makeFormToken() },
      { headers: privateHeaders },
    );
  } catch {
    return Response.json(
      {
        error:
          "The form is temporarily unavailable. Please try again or contact Namrata on Instagram.",
      },
      { status: 503, headers: privateHeaders },
    );
  }
}
