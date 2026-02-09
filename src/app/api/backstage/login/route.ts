import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { pin } = await req.json().catch(() => ({ pin: "" }));

  const expected = process.env.ADMIN_PIN;

  if (!expected) {
    return NextResponse.json(
      { error: "ADMIN_PIN no está configurado" },
      { status: 500 }
    );
  }

  if (pin !== expected) {
    return NextResponse.json({ error: "PIN incorrecto" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });

  // Cookie simple (7 días)
  res.cookies.set("admin_session", "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
