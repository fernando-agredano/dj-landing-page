import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

type EventStatus = "Reservado" | "Tentativo";
type EventType = "Club" | "Festival" | "Privado";

function mapRow(row: any) {
  // Date llega como Date o string según driver, aseguramos YYYY-MM-DD
  const date =
    typeof row.date === "string"
      ? row.date.slice(0, 10)
      : new Date(row.date).toISOString().slice(0, 10);

  // Start_time puede llegar como "21:00:00" -> "21:00"
  const startTime =
    typeof row.start_time === "string"
      ? row.start_time.slice(0, 5)
      : String(row.start_time).slice(0, 5);

  return {
    id: row.id,
    status: row.status as EventStatus,
    type: row.type as EventType,
    date,
    startTime,
    title: row.title ?? "",
    venue: row.venue ?? "",
    city: row.city ?? "",
  };
}

export async function GET() {
  try {
    // Filtra por dia
    const rows = await sql`
      SELECT id, status, type, date, start_time, title, venue, city
      FROM events
      WHERE date >= (now() AT TIME ZONE 'America/Mexico_City')::date
      ORDER BY date ASC, start_time ASC
    `;

    const events = rows.map(mapRow);
    return NextResponse.json({ ok: true, events });
  } catch (err: any) {
    console.error("GET /api/events error:", err);
    return NextResponse.json(
      { ok: false, error: "Error consultando eventos" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { ok: false, error: "Body inválido" },
        { status: 400 }
      );
    }

    const status = body.status as EventStatus;
    const type = body.type as EventType;
    const date = String(body.date || "");
    const startTime = String(body.startTime || "");
    const title = String(body.title || "");
    const venue = String(body.venue || "");
    const city = String(body.city || "");

    if (!date) return NextResponse.json({ ok: false, error: "Fecha requerida" }, { status: 400 });
    if (!startTime) return NextResponse.json({ ok: false, error: "Hora requerida" }, { status: 400 });
    if (!city.trim()) return NextResponse.json({ ok: false, error: "Ciudad requerida" }, { status: 400 });

    // Regla: Privado fuerza título y venue vacío
    const safeTitle = type === "Privado" ? "Evento Privado" : title.trim();
    const safeVenue = type === "Privado" ? "" : venue.trim();

    if (type !== "Privado") {
      if (!safeTitle) return NextResponse.json({ ok: false, error: "Título requerido" }, { status: 400 });
      if (!safeVenue) return NextResponse.json({ ok: false, error: "Lugar requerido" }, { status: 400 });
    }

    // Insert
    const inserted = await sql`
      INSERT INTO events (status, type, date, start_time, title, venue, city)
      VALUES (${status}, ${type}, ${date}, ${startTime}, ${safeTitle}, ${safeVenue}, ${city.trim()})
      RETURNING id, status, type, date, start_time, title, venue, city
    `;

    const event = mapRow(inserted[0]);
    return NextResponse.json({ ok: true, event });
  } catch (err: any) {
    console.error("POST /api/events error:", err);
    return NextResponse.json(
      { ok: false, error: "Error guardando evento" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const id = String(body?.id ?? "").trim();

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "ID requerido" },
        { status: 400 }
      );
    }

    const deleted = await sql`
      DELETE FROM events
      WHERE id = ${id}
      RETURNING id
    `;

    if (!deleted?.length) {
      return NextResponse.json(
        { ok: false, error: "Evento no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, id });
  } catch (err: any) {
    console.error("DELETE /api/events error:", err);
    return NextResponse.json(
      { ok: false, error: "Error eliminando evento" },
      { status: 500 }
    );
  }
}
