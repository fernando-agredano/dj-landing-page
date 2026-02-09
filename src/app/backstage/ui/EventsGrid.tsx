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
  IconButton,
  Tooltip,
} from "@mui/material";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import LockIcon from "@mui/icons-material/Lock";
import PendingIcon from "@mui/icons-material/HourglassTop";
import PublicIcon from "@mui/icons-material/Public";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { motion } from "framer-motion";
import type { DJEvent, EventStatus } from "./AddEventModal";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

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
      return {
        color: "error" as const,
        variant: "filled" as const,
        label: "Reservado",
      };
    case "Tentativo":
      return {
        color: "warning" as const,
        variant: "outlined" as const,
        label: "Pendiente",
      };
    default:
      return {
        color: "default" as const,
        variant: "outlined" as const,
        label: String(status),
      };
  }
}

function EventCard({
  ev,
  onDelete,
}: {
  ev: DJEvent;
  onDelete: (ev: DJEvent) => void;
}) {
  const isPrivate = ev.type === "Privado";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE_OUT }}
      style={{ height: "100%" }}
    >
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        style={{ height: "100%" }}
      >
        <Card
          sx={{
            height: "100%",
            minHeight: 210,
            borderRadius: 2,
            border: "1px solid rgba(255,255,255,0.10)",
            bgcolor: "rgba(15,15,18,0.42)",
            backdropFilter: "blur(10px)",
            boxShadow:
              "0 22px 70px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Botón eliminar (esquina inferior derecha) */}
          <Tooltip title="Eliminar">
            <IconButton
              onClick={() => onDelete(ev)}
              sx={{
                position: "absolute",
                right: 10,
                bottom: 10,
                zIndex: 2,
                border: "1px solid rgba(255,255,255,0.12)",
                bgcolor: "rgba(0,0,0,0.25)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.55)" },
              }}
              aria-label="Eliminar evento"
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <CardContent
            sx={{
              py: 1.5,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              height: "100%",
            }}
          >
            <Stack
              direction="row"
              alignItems="baseline"
              justifyContent="space-between"
            >
              <Typography
                variant="overline"
                sx={{ letterSpacing: 1.2, opacity: 0.9 }}
              >
                {formatDatePretty(ev.date)}
              </Typography>

              <Chip size="small" {...statusChipProps(ev.status)} />
            </Stack>

            <Divider sx={{ opacity: 0.22 }} />

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="center"
              sx={{ mt: 0.5 }}
            >
              <AccessTimeIcon sx={{ fontSize: 16, opacity: 0.85 }} />
              <Typography variant="body2" sx={{ fontWeight: 900 }}>
                {ev.startTime}
              </Typography>
            </Stack>

            <Box sx={{ flex: 1, display: "grid", placeItems: "center" }}>
              {isPrivate ? (
                <Stack
                  spacing={1}
                  alignItems="center"
                  sx={{ textAlign: "center" }}
                >
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
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ opacity: 0.9 }}
                  >
                    Ciudad: {ev.city}
                  </Typography>
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
                </Stack>
              )}
            </Box>

            <Stack direction="row" justifyContent="center" sx={{ mt: 0.25 }}>
              <Chip
                size="small"
                label={ev.type}
                variant="outlined"
                sx={{
                  borderColor: "rgba(255,255,255,0.16)",
                  color: "rgba(255,255,255,0.82)",
                }}
              />
            </Stack>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export function EventsGrid({
  title,
  icon,
  events,
  onDelete,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  events: DJEvent[];
  onDelete: (ev: DJEvent) => void;
}) {
  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          {icon}
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {title}
          </Typography>
        </Stack>
      </motion.div>

      {events.length === 0 ? (
        <Typography color="text.secondary">Sin eventos por ahora.</Typography>
      ) : (
        <Box
          sx={{
            width: "100%",
            display: "grid",
            justifyContent: "center",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(240px, 280px))",
              md: "repeat(3, minmax(240px, 280px))",
              lg: "repeat(5, minmax(220px, 260px))",
            },
            gap: 2,
            "& > *": {
              justifySelf: { xs: "center", sm: "stretch" },
            },
          }}
        >
          {events.map((ev) => (
            <Box
              key={ev.id ?? `${ev.date}-${ev.startTime}-${ev.title}`}
              sx={{ width: "100%" }}
            >
              <EventCard ev={ev} onDelete={onDelete} />
            </Box>
          ))}
        </Box>
      )}
    </Stack>
  );
}
