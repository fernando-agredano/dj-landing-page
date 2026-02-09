import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

type EventStatus = "Reservado" | "Tentativo";
type EventType = "Club" | "Festival" | "Privado";

/**
 * Tipado mínimo para las filas devueltas por la DB.
 * Ajusta si tu driver devuelve `id` como number, etc.
 */
type EventRow = {
  id: string | number;
  status: EventStatus;
  type: EventType;
  date: string | Date;
  start_time: string | Date | number;
  title: string | null;
  venue: string | null;
  city: string | null;
};

function mapRow(row: EventRow) {
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
    id: String(row.id),
    status: row.status,
    type: row.type,
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
    const rows = (await sql`
      SELECT id, status, type, date, start_time, title, venue, city
      FROM events
      WHERE date >= (now() AT TIME ZONE 'America/Mexico_City')::date
      ORDER BY date ASC, start_time ASC
    `) as EventRow[];

    const events = rows.map(mapRow);
    return NextResponse.json({ ok: true, events });
  } catch (err: unknown) {
    console.error("GET /api/events error:", err);
    return NextResponse.json(
      { ok: false, error: "Error consultando eventos" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "Body inválido" },
        { status: 400 }
      );
    }

    const b = body as Record<string, unknown>;

    const status = b.status as EventStatus;
    const type = b.type as EventType;
    const date = String(b.date ?? "");
    const startTime = String(b.startTime ?? "");
    const title = String(b.title ?? "");
    const venue = String(b.venue ?? "");
    const city = String(b.city ?? "");

    if (!date)
      return NextResponse.json(
        { ok: false, error: "Fecha requerida" },
        { status: 400 }
      );
    if (!startTime)
      return NextResponse.json(
        { ok: false, error: "Hora requerida" },
        { status: 400 }
      );
    if (!city.trim())
      return NextResponse.json(
        { ok: false, error: "Ciudad requerida" },
        { status: 400 }
      );

    // Regla: Privado fuerza título y venue vacío
    const safeTitle = type === "Privado" ? "Evento Privado" : title.trim();
    const safeVenue = type === "Privado" ? "" : venue.trim();

    if (type !== "Privado") {
      if (!safeTitle)
        return NextResponse.json(
          { ok: false, error: "Título requerido" },
          { status: 400 }
        );
      if (!safeVenue)
        return NextResponse.json(
          { ok: false, error: "Lugar requerido" },
          { status: 400 }
        );
    }

    // Insert
    const inserted = (await sql`
      INSERT INTO events (status, type, date, start_time, title, venue, city)
      VALUES (${status}, ${type}, ${date}, ${startTime}, ${safeTitle}, ${safeVenue}, ${city.trim()})
      RETURNING id, status, type, date, start_time, title, venue, city
    `) as EventRow[];

    const event = mapRow(inserted[0]);
    return NextResponse.json({ ok: true, event });
  } catch (err: unknown) {
    console.error("POST /api/events error:", err);
    return NextResponse.json(
      { ok: false, error: "Error guardando evento" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body: unknown = await req.json().catch(() => null);

    const b =
      body && typeof body === "object" ? (body as Record<string, unknown>) : null;

    const id = String(b?.id ?? "").trim();

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "ID requerido" },
        { status: 400 }
      );
    }

    const deleted = (await sql`
      DELETE FROM events
      WHERE id = ${id}
      RETURNING id
    `) as Array<{ id: string | number }>;

    if (!deleted?.length) {
      return NextResponse.json(
        { ok: false, error: "Evento no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, id: String(deleted[0].id) });
  } catch (err: unknown) {
    console.error("DELETE /api/events error:", err);
    return NextResponse.json(
      { ok: false, error: "Error eliminando evento" },
      { status: 500 }
    );
  }
}
