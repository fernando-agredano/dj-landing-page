"use client";

import * as React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";

import {
  AddEventModal,
  DJEvent,
  EventStatus,
  EventType,
} from "./ui/AddEventModal";
import { StatsPanel } from "./ui/StatsPanel";
import BackstageNavbar from "./ui/BackstageNavbar";
import { EventsByCategoryCarousel } from "./ui/EventsByCategoryCarousel";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerV = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } },
};

function groupByType(events: DJEvent[]) {
  const sortFn = (a: DJEvent, b: DJEvent) =>
    a.date + a.startTime > b.date + b.startTime ? 1 : -1;

  const priv = events.filter((e) => e.type === "Privado").sort(sortFn);
  const club = events.filter((e) => e.type === "Club").sort(sortFn);
  const fest = events.filter((e) => e.type === "Festival").sort(sortFn);

  return { priv, club, fest };
}

export default function BackstagePage() {
  const [active, setActive] = React.useState<"agenda" | "stats">("agenda");
  const [open, setOpen] = React.useState(false);
  const [events, setEvents] = React.useState<DJEvent[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Estado para borrar
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [eventToDelete, setEventToDelete] = React.useState<DJEvent | null>(
    null,
  );

  async function loadEvents() {
    setLoading(true);
    try {
      const res = await fetch("/api/events", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const json = await res.json();
      if (!json?.ok) throw new Error(json?.error || "Error");

      setEvents(json.events as DJEvent[]);
    } catch (err) {
      console.error("Error cargando eventos:", err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadEvents();
  }, []);

  const grouped = React.useMemo(() => groupByType(events), [events]);

  const stats = React.useMemo(() => {
    const total = events.length;
    const reserved = events.filter((e) => e.status === "Reservado").length;
    const pending = events.filter((e) => e.status === "Tentativo").length;

    const byType = {
      Privado: events.filter((e) => e.type === "Privado").length,
      Club: events.filter((e) => e.type === "Club").length,
      Festival: events.filter((e) => e.type === "Festival").length,
    };

    return { total, reserved, pending, byType };
  }, [events]);

  async function onAddEvent(data: {
    status: EventStatus;
    type: EventType;
    date: string;
    startTime: string;
    title: string;
    venue: string;
    city: string;
  }) {
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!json?.ok) throw new Error(json?.error || "Error guardando");

      await loadEvents();
    } catch (err) {
      console.error("Error guardando evento:", err);
      alert("No se pudo guardar el evento.");
    }
  }

  // Abrir modal de confirmación desde cualquier card
  function askDelete(ev: DJEvent) {
    setEventToDelete(ev);
    setDeleteOpen(true);
  }

  // Ejecutar delete
  async function confirmDelete() {
    if (!eventToDelete) return;

    setDeleteLoading(true);
    try {
      const res = await fetch("/api/events", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: eventToDelete.id }),
      });

      const json = await res.json();
      if (!json?.ok) throw new Error(json?.error || "Error eliminando");

      await loadEvents();

      setDeleteOpen(false);
      setEventToDelete(null);
    } catch (err) {
      console.error("Error eliminando evento:", err);
      alert("No se pudo eliminar el evento.");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <>
      <BackstageNavbar
        active={active}
        onChange={setActive}
        onAgendar={() => setOpen(true)}
      />

      <motion.div variants={containerV} initial="hidden" animate="show">
        <Box
          sx={{
            position: "relative",
            borderRadius: 0,
            p: { xs: 2, md: 3 },
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.10)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(0,0,0,0.0))",
            backgroundColor: "rgba(10,10,14,0.92)",
            backdropFilter: "none",
            boxShadow: "0 28px 90px rgba(0,0,0,0.55)",
            "&:before": {
              content: '""',
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              opacity: 0.08,
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27120%27 height=%27120%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.8%27 numOctaves=%272%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27120%27 height=%27120%27 filter=%27url(%23n)%27 opacity=%270.35%27/%3E%3C/svg%3E")',
              mixBlendMode: "overlay",
            },
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            {active === "agenda" ? (
              <Stack spacing={3}>
                {loading ? (
                  <Typography sx={{ color: "rgba(255,255,255,0.65)" }}>
                    Cargando eventos…
                  </Typography>
                ) : null}

                {/* KPIs */}
                <Box sx={{ display: "grid", placeItems: "center" }}>
                  <Box
                    sx={{
                      width: "100%",
                      maxWidth: 980,
                      display: "grid",
                      gap: 2,
                      gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                      mb: 1,
                    }}
                  >
                    {/* TOTAL */}
                    <Box
                      sx={{
                        border: "1px solid rgba(255,255,255,0.10)",
                        bgcolor: "rgba(15,15,18,0.42)",
                        backdropFilter: "blur(10px)",
                        borderRadius: 2,
                        p: 2.25,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        aria-hidden
                        sx={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "radial-gradient(520px 220px at 15% 10%, rgba(255,255,255,0.06), transparent 60%)",
                          pointerEvents: "none",
                        }}
                      />
                      <Typography
                        variant="overline"
                        sx={{ opacity: 0.75, letterSpacing: 4 }}
                      >
                        TOTAL
                      </Typography>
                      <Typography
                        sx={{ fontWeight: 950, fontSize: 34, lineHeight: 1.1 }}
                      >
                        {stats.total}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255,255,255,0.62)" }}
                      >
                        eventos en agenda
                      </Typography>
                      <Box
                        sx={{
                          mt: 1.5,
                          height: 3,
                          bgcolor: "rgba(255,255,255,0.16)",
                        }}
                      />
                    </Box>

                    {/* RESERVADOS */}
                    <Box
                      sx={{
                        border: "1px solid rgba(255,255,255,0.10)",
                        bgcolor: "rgba(15,15,18,0.42)",
                        backdropFilter: "blur(10px)",
                        borderRadius: 2,
                        p: 2.25,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        aria-hidden
                        sx={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "radial-gradient(520px 220px at 15% 10%, rgba(255,255,255,0.06), transparent 60%)",
                          pointerEvents: "none",
                        }}
                      />
                      <Typography
                        variant="overline"
                        sx={{ opacity: 0.75, letterSpacing: 4 }}
                      >
                        RESERVADOS
                      </Typography>
                      <Typography
                        sx={{ fontWeight: 950, fontSize: 34, lineHeight: 1.1 }}
                      >
                        {stats.reserved}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255,255,255,0.62)" }}
                      >
                        confirmados
                      </Typography>
                      <Box
                        sx={{
                          mt: 1.5,
                          height: 3,
                          bgcolor: "rgba(255,255,255,0.16)",
                        }}
                      />
                    </Box>

                    {/* PENDIENTES */}
                    <Box
                      sx={{
                        border: "1px solid rgba(255,255,255,0.10)",
                        bgcolor: "rgba(15,15,18,0.42)",
                        backdropFilter: "blur(10px)",
                        borderRadius: 2,
                        p: 2.25,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        aria-hidden
                        sx={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "radial-gradient(520px 220px at 15% 10%, rgba(255,255,255,0.06), transparent 60%)",
                          pointerEvents: "none",
                        }}
                      />
                      <Typography
                        variant="overline"
                        sx={{ opacity: 0.75, letterSpacing: 4 }}
                      >
                        PENDIENTES
                      </Typography>
                      <Typography
                        sx={{ fontWeight: 950, fontSize: 34, lineHeight: 1.1 }}
                      >
                        {stats.pending}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255,255,255,0.62)" }}
                      >
                        por confirmar
                      </Typography>
                      <Box
                        sx={{
                          mt: 1.5,
                          height: 3,
                          bgcolor: "rgba(255,255,255,0.16)",
                        }}
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Pasa callback */}
                <EventsByCategoryCarousel
                  grouped={grouped}
                  onDelete={askDelete}
                />
              </Stack>
            ) : (
              <StatsPanel stats={stats} />
            )}
          </Box>
        </Box>

        <AddEventModal
          open={open}
          onClose={() => setOpen(false)}
          onSubmit={async (data) => {
            await onAddEvent({ ...data });
            setOpen(false);
          }}
        />

        {/* Modal confirmación */}
        <Dialog
          open={deleteOpen}
          onClose={() => (deleteLoading ? null : setDeleteOpen(false))}
          BackdropProps={{
            sx: {
              backgroundColor: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(2px)",
            },
          }}
          PaperProps={{
            sx: {
              borderRadius: 3,
              bgcolor: "rgba(6,6,9,0.96)",
              backdropFilter: "blur(18px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow:
                "0 40px 120px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.92)",
              minWidth: { xs: "92vw", sm: 420 },
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 950, letterSpacing: 1 }}>
            ¿ELIMINAR EVENTO?
          </DialogTitle>

          <DialogContent sx={{ pt: 1 }}>
            <Typography sx={{ color: "rgba(255,255,255,0.65)", mt: 0.5 }}>
              Esta acción no se puede deshacer.
            </Typography>

            {eventToDelete ? (
              <Box sx={{ mt: 1.5 }}>
                <Typography sx={{ fontWeight: 900 }}>
                  {eventToDelete.type} · {eventToDelete.date} ·{" "}
                  {eventToDelete.startTime}
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.6)" }}>
                  {eventToDelete.title || "Evento"}
                  {eventToDelete.city ? ` · ${eventToDelete.city}` : ""}
                </Typography>
              </Box>
            ) : null}
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button
              variant="outlined"
              disabled={deleteLoading}
              onClick={() => setDeleteOpen(false)}
              sx={{
                borderColor: "rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.75)",
                fontWeight: 800,
                "&:hover": { borderColor: "rgba(255,255,255,0.35)" },
              }}
            >
              CANCELAR
            </Button>

            <Button
              variant="contained"
              disabled={deleteLoading}
              onClick={confirmDelete}
              sx={{
                fontWeight: 950,
                bgcolor: "#ff4d3f",
                "&:hover": { bgcolor: "#ff2e1f" },
              }}
            >
              {deleteLoading ? "ELIMINANDO..." : "ELIMINAR"}
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </>
  );
}
