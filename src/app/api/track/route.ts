import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id, path, referrer, ua, sw, sh, sid } = body;

    if (!id || !path) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400, headers: corsHeaders }
      );
    }

    await convex.mutation(api.analytics.recordPageView, {
      trackingId: id,
      path,
      referrer: referrer || undefined,
      userAgent: ua || req.headers.get("user-agent") || undefined,
      screenWidth: sw ? Number(sw) : undefined,
      screenHeight: sh ? Number(sh) : undefined,
      sessionId: sid || undefined,
    });

    return NextResponse.json({ ok: true }, { headers: corsHeaders });
  } catch {
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
