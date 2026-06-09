import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    if (!password || typeof password !== "string") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
