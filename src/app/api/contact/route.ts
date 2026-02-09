import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json().catch(() => null);

    const b =
      body && typeof body === "object" ? (body as Record<string, unknown>) : null;

    const name = String(b?.name ?? "").trim();
    const email = String(b?.email ?? "").trim();
    const message = String(b?.message ?? "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Faltan campos requeridos." },
        { status: 400 }
      );
    }

    if (!isEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Email inválido." },
        { status: 400 }
      );
    }

    // Variables de entorno
    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_PORT = Number(process.env.SMTP_PORT || "587");
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;

    // A dónde llega el correo (email destino)
    const CONTACT_TO =
      process.env.CONTACT_TO || "produccionesbiosfera@gmail.com";
    // De quién “sale” (normalmente debe ser el mismo SMTP_USER o un alias permitido)
    const CONTACT_FROM = process.env.CONTACT_FROM || SMTP_USER;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_FROM) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Falta configurar SMTP en variables de entorno (SMTP_HOST/SMTP_USER/SMTP_PASS/CONTACT_FROM).",
        },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const subject = `Nuevo mensaje desde Contacto: ${name}`;

    const text = [
      `Nombre: ${name}`,
      `Email: ${email}`,
      ``,
      `Mensaje:`,
      message,
    ].join("\n");

    const html = `
      <div style="font-family: Arial, sans-serif; line-height:1.4">
        <h2>Nuevo mensaje desde el sitio</h2>
        <p><b>Nombre:</b> ${escapeHtml(name)}</p>
        <p><b>Email:</b> ${escapeHtml(email)}</p>
        <hr/>
        <p style="white-space: pre-wrap">${escapeHtml(message)}</p>
      </div>
    `;

    await transporter.sendMail({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      subject,
      text,
      html,
      replyTo: email,
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("CONTACT ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "No se pudo enviar el mensaje." },
      { status: 500 }
    );
  }
}

// Helper básico anti HTML injection
function escapeHtml(str: string) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
