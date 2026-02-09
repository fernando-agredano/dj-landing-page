"use client";

import * as React from "react";
import {
  Box,
  Stack,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider,
  Skeleton,
  IconButton,
} from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LockIcon from "@mui/icons-material/Lock";
import PendingIcon from "@mui/icons-material/HourglassTop";
import PublicIcon from "@mui/icons-material/Public";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

type EventStatus = "Reservado" | "Tentativo";
type EventType = "Club" | "Festival" | "Privado";

type ApiEvent = {
  id: string;
  status: EventStatus;
  type: EventType;
  date: string;
  startTime: string;
  title: string;
  venue: string;
  city: string;
};

type DJEvent = {
  id: string;
  date: string;
  time: string;
  endTime?: string;
  title: string;
  venue: string;
  city: string;
  type: EventType;
  status: EventStatus;
  note?: string;
};

function formatDatePretty(dateISO: string) {
  const d = new Date(`${dateISO}T00:00:00`);
  const weekday = d
    .toLocaleDateString("es-MX", { weekday: "short" })
    .toUpperCase();
  const date = d.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return `${weekday} · ${date}`;
}

function statusChipProps(status: EventStatus) {
  switch (status) {
    case "Reservado":
      return { color: "error" as const, variant: "filled" as const };
    case "Tentativo":
      return { color: "warning" as const, variant: "outlined" as const };
  }
}

function SectionHeader({ title }: { title: string }) {
  return (
    <Stack spacing={0.5} sx={{ mb: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
      </Stack>
    </Stack>
  );
}

function EventCard({ ev }: { ev: DJEvent }) {
  const isPrivate = ev.type === "Privado";
  const timeLabel =
    isPrivate && ev.endTime ? `${ev.time} – ${ev.endTime}` : ev.time;

  return (
    <Card
      sx={{
        height: "100%",
        minHeight: 220,
        borderRadius: 2,
        border: "1px solid rgba(255,255,255,0.10)",
        bgcolor: "rgba(15,15,18,0.45)",
        backdropFilter: "blur(6px)",
        overflow: "hidden",
        display: "flex",
      }}
    >
      <CardContent
        sx={{
          py: 1.5,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {/* Top: fecha + status */}
        <Stack
          direction="row"
          alignItems="baseline"
          justifyContent="space-between"
          sx={{ mb: 0.25 }}
        >
          <Typography
            variant="overline"
            sx={{ letterSpacing: 1.2, opacity: 0.9 }}
          >
            {formatDatePretty(ev.date)}
          </Typography>

          <Chip
            size="small"
            label={ev.status}
            {...statusChipProps(ev.status)}
          />
        </Stack>

        <Divider sx={{ opacity: 0.25 }} />

        {/* Horario */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="center"
          sx={{ mt: 0.5 }}
        >
          <AccessTimeIcon sx={{ fontSize: 16, opacity: 0.85 }} />
          <Typography variant="body2" sx={{ fontWeight: 900 }}>
            {timeLabel}
          </Typography>
        </Stack>

        {/* Contenido flexible */}
        <Box sx={{ flex: 1, display: "grid", placeItems: "center" }}>
          {isPrivate ? (
            <Stack spacing={1} alignItems="center" sx={{ textAlign: "center" }}>
              {ev.status === "Reservado" ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <LockIcon sx={{ fontSize: 18, opacity: 0.9 }} />
                  <Typography variant="caption" color="text.secondary">
                    Bloque privado
                  </Typography>
                </Stack>
              ) : (
                <Stack direction="row" spacing={1} alignItems="center">
                  <PendingIcon sx={{ fontSize: 18, opacity: 0.9 }} />
                  <Typography variant="caption" color="text.secondary">
                    Pendiente de confirmación
                  </Typography>
                </Stack>
              )}

              {ev.note ? (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ opacity: 0.9 }}
                >
                  {ev.note}
                </Typography>
              ) : null}
            </Stack>
          ) : (
            <Stack
              spacing={0.75}
              alignItems="center"
              sx={{ textAlign: "center" }}
            >
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="center"
              >
                <PublicIcon sx={{ fontSize: 18, opacity: 0.85 }} />
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 900, lineHeight: 1.1 }}
                >
                  {ev.title}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="center"
              >
                <PlaceIcon sx={{ fontSize: 16, opacity: 0.85 }} />
                <Typography variant="caption" color="text.secondary">
                  {ev.venue} · {ev.city}
                </Typography>
              </Stack>

              {ev.note ? (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ opacity: 0.9 }}
                >
                  {ev.note}
                </Typography>
              ) : null}
            </Stack>
          )}
        </Box>

        {/* Bottom: tipo */}
        <Stack direction="row" justifyContent="center" sx={{ mt: 0.25 }}>
          <Chip
            size="small"
            label={ev.type}
            variant="outlined"
            sx={{
              borderColor: "rgba(255,255,255,0.18)",
              color: "rgba(255,255,255,0.85)",
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

/* Skeleton que respeta el look & tamaño del card real */
function EventCardSkeleton() {
  return (
    <Card
      sx={{
        height: "100%",
        minHeight: 220,
        borderRadius: 2,
        border: "1px solid rgba(255,255,255,0.10)",
        bgcolor: "rgba(15,15,18,0.45)",
        backdropFilter: "blur(6px)",
        overflow: "hidden",
        display: "flex",
      }}
    >
      <CardContent
        sx={{
          py: 1.5,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Skeleton variant="text" width={120} height={18} />
          <Skeleton variant="rounded" width={74} height={22} />
        </Stack>

        <Divider sx={{ opacity: 0.25 }} />

        <Stack direction="row" justifyContent="center" sx={{ mt: 0.5 }}>
          <Skeleton variant="text" width={90} height={20} />
        </Stack>

        <Box sx={{ flex: 1, display: "grid", placeItems: "center" }}>
          <Stack spacing={1} alignItems="center" sx={{ width: "100%" }}>
            <Skeleton variant="text" width="70%" height={26} />
            <Skeleton variant="text" width="55%" height={18} />
            <Skeleton variant="text" width="45%" height={18} />
          </Stack>
        </Box>

        <Stack direction="row" justifyContent="center">
          <Skeleton variant="rounded" width={90} height={24} />
        </Stack>
      </CardContent>
    </Card>
  );
}

function CategoryCarousel({
  items,
  renderItem,
  itemWidth = 340,
  emptyText,
}: {
  items: DJEvent[];
  renderItem: (ev: DJEvent) => React.ReactNode;
  itemWidth?: number;
  emptyText?: string;
}) {
  const scrollerRef = React.useRef<HTMLDivElement | null>(null);

  const scrollByCards = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const gapPx = 16;
    el.scrollBy({ left: dir * (itemWidth + gapPx) * 2, behavior: "smooth" });
  };

  if (!items.length) {
    return (
      <Box sx={{ py: 1 }}>
        <Typography sx={{ color: "rgba(255,255,255,0.65)" }}>
          {emptyText ?? "Sin eventos en esta categoría."}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative" }}>
      {/* Flecha izquierda */}
      <IconButton
        onClick={() => scrollByCards(-1)}
        aria-label="Scroll izquierda"
        sx={{
          position: "absolute",
          left: -10,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          bgcolor: "rgba(0,0,0,0.35)",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(6px)",
          "&:hover": { bgcolor: "rgba(0,0,0,0.55)" },
          display: { xs: "none", sm: "inline-flex" },
        }}
      >
        <ChevronLeftIcon />
      </IconButton>

      {/* Flecha derecha */}
      <IconButton
        onClick={() => scrollByCards(1)}
        aria-label="Scroll derecha"
        sx={{
          position: "absolute",
          right: -10,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          bgcolor: "rgba(0,0,0,0.35)",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(6px)",
          "&:hover": { bgcolor: "rgba(0,0,0,0.55)" },
          display: { xs: "none", sm: "inline-flex" },
        }}
      >
        <ChevronRightIcon />
      </IconButton>

      {/* Track */}
      <Box
        ref={scrollerRef}
        sx={{
          display: "grid",
          gridAutoFlow: "column",
          gridAutoColumns: `${itemWidth}px`,
          gap: 2,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          px: 0.5,
          py: 0.5,

          // Scrollbar sutil
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": { height: 10 },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255,255,255,0.18)",
            borderRadius: 999,
          },
        }}
      >
        {items.map((ev) => (
          <Box key={ev.id} sx={{ scrollSnapAlign: "start" }}>
            {renderItem(ev)}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function SkeletonCarousel({
  count,
  itemWidth = 340,
}: {
  count: number;
  itemWidth?: number;
}) {
  return (
    <Box
      sx={{
        display: "grid",
        gridAutoFlow: "column",
        gridAutoColumns: `${itemWidth}px`,
        gap: 2,
        overflowX: "hidden",
        px: 0.5,
        py: 0.5,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Box key={i}>
          <EventCardSkeleton />
        </Box>
      ))}
    </Box>
  );
}

async function fetchEventsFromApi(signal?: AbortSignal): Promise<DJEvent[]> {
  const r = await fetch("/api/events", {
    method: "GET",
    cache: "no-store",
    signal,
  });

  const j = await r.json().catch(() => null);

  if (!r.ok || !j?.ok) {
    throw new Error(j?.error || "Error cargando eventos");
  }

  const apiEvents: ApiEvent[] = Array.isArray(j.events) ? j.events : [];

  return apiEvents.map((e) => ({
    id: e.id,
    date: e.date,
    time: e.startTime,
    title: e.title ?? "",
    venue: e.venue ?? "",
    city: e.city ?? "",
    type: e.type,
    status: e.status,
  }));
}

export default function Events() {
  const [events, setEvents] = React.useState<DJEvent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchEventsFromApi(controller.signal);
        setEvents(data);
      } catch (e: unknown) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        const msg = e instanceof Error ? e.message : "Error cargando eventos";
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const grouped = React.useMemo(() => {
    const sortFn = (a: DJEvent, b: DJEvent) =>
      a.date + a.time > b.date + b.time ? 1 : -1;

    const priv = events.filter((e) => e.type === "Privado").sort(sortFn);
    const club = events.filter((e) => e.type === "Club").sort(sortFn);
    const fest = events.filter((e) => e.type === "Festival").sort(sortFn);

    return { priv, club, fest };
  }, [events]);

  const ITEM_WIDTH = 340;

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 3,
        p: { xs: 2, md: 3 },
        background:
          "radial-gradient(900px 420px at 20% 0%, rgba(255,255,255,0.06), transparent 60%)," +
          "radial-gradient(800px 380px at 85% 20%, rgba(255,255,255,0.05), transparent 55%)," +
          "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(0,0,0,0.0))",
        border: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}
    >
      {/* Grano sutil */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.18,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.85), rgba(0,0,0,0.10))",
        }}
      />

      {/* Header */}
      <Stack spacing={1.2} sx={{ mb: 3, position: "relative", zIndex: 1 }}>
        <Stack direction="row" spacing={1.2} alignItems="center">
          <EventAvailableIcon sx={{ opacity: 0.9 }} />
          <Stack spacing={0.4}>
            <Typography
              variant="overline"
              sx={{
                letterSpacing: 6,
                opacity: 0.85,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              AGENDA
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 200,
                lineHeight: 1.02,
                fontSize: 30,
              }}
            >
              Proximos Eventos
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      {/* Body */}
      <Box sx={{ position: "relative", zIndex: 1 }}>
        {loading ? (
          <>
            <Box sx={{ mb: 3 }}>
              <SectionHeader title="Privados" />
              <SkeletonCarousel count={4} itemWidth={ITEM_WIDTH} />
            </Box>

            <Box sx={{ mb: 3 }}>
              <SectionHeader title="Clubs" />
              <SkeletonCarousel count={4} itemWidth={ITEM_WIDTH} />
            </Box>

            <Box>
              <SectionHeader title="Festivales" />
              <SkeletonCarousel count={4} itemWidth={ITEM_WIDTH} />
            </Box>
          </>
        ) : error ? (
          <Box sx={{ py: 6 }}>
            <Typography sx={{ fontWeight: 900, mb: 0.5 }}>
              No se pudo cargar la agenda
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.65)" }}>
              {error}
            </Typography>
          </Box>
        ) : events.length === 0 ? (
          <Box sx={{ py: 6 }}>
            <Typography sx={{ fontWeight: 900 }}>
              No hay eventos por mostrar
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.65)" }}>
              Cuando agendes en Backstage, aparecerán aquí.
            </Typography>
          </Box>
        ) : (
          <>
            {/* Privados */}
            <Box sx={{ mb: 3 }}>
              <SectionHeader title="Privados" />
              <CategoryCarousel
                items={grouped.priv}
                itemWidth={ITEM_WIDTH}
                renderItem={(ev) => <EventCard ev={ev} />}
                emptyText="No hay privados."
              />
            </Box>

            {/* Clubs */}
            <Box sx={{ mb: 3 }}>
              <SectionHeader title="Clubs" />
              <CategoryCarousel
                items={grouped.club}
                itemWidth={ITEM_WIDTH}
                renderItem={(ev) => <EventCard ev={ev} />}
                emptyText="No hay clubs."
              />
            </Box>

            {/* Festivales */}
            <Box>
              <SectionHeader title="Festivales" />
              <CategoryCarousel
                items={grouped.fest}
                itemWidth={ITEM_WIDTH}
                renderItem={(ev) => <EventCard ev={ev} />}
                emptyText="No hay festivales."
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
