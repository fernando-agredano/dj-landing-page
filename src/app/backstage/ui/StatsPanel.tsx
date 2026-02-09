"use client";

import * as React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";

type Stats = {
  total: number;
  reserved: number;
  pending: number;
  byType: { Privado: number; Club: number; Festival: number };
};

function StatCard({
  label,
  value,
  subtitle,
  glow,
  bar,
}: {
  label: string;
  value: number;
  subtitle: string;
  glow: string;
  bar: string;
}) {
  return (
    <Box
      sx={{
        border: "1px solid rgba(255,255,255,0.10)",
        bgcolor: "rgba(15,15,18,0.42)",
        backdropFilter: "blur(10px)",
        borderRadius: 2,
        p: 1.6,
        position: "relative",
        overflow: "hidden",
        minHeight: 118,
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          background: glow,
          pointerEvents: "none",
        }}
      />
      <Typography
        variant="overline"
        sx={{ opacity: 0.75, letterSpacing: 4, fontSize: 10 }}
      >
        {label}
      </Typography>

      <Typography sx={{ fontWeight: 950, fontSize: 28, lineHeight: 1.05 }}>
        {value}
      </Typography>

      <Typography
        variant="body2"
        sx={{ color: "rgba(255,255,255,0.62)", fontSize: 13 }}
      >
        {subtitle}
      </Typography>

      <Box sx={{ mt: 1.2, height: 3, bgcolor: bar }} />
    </Box>
  );
}

function VerticalBarChart({
  title,
  subtitle,
  data,
}: {
  title: string;
  subtitle?: string;
  data: { label: string; value: number; color: string }[];
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const chartHeight = 240;

  return (
    <Box
      sx={{
        border: "1px solid rgba(255,255,255,0.10)",
        bgcolor: "rgba(15,15,18,0.38)",
        backdropFilter: "blur(10px)",
        borderRadius: 2,
        p: 2.25,
      }}
    >
      <Stack spacing={0.35} sx={{ mb: 2 }}>
        <Typography sx={{ fontWeight: 900 }}>{title}</Typography>
        {subtitle ? (
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.60)" }}>
            {subtitle}
          </Typography>
        ) : null}
      </Stack>

      <Box
        sx={{
          height: 340,
          display: "grid",
          gridTemplateColumns: {
            xs: `repeat(${data.length}, 72px)`,
            sm: `repeat(${data.length}, 1fr)`,
          },
          justifyContent: "center",
          gap: { xs: 2.5, sm: 5 },
          alignItems: "end",
        }}
      >
        {data.map((d) => {
          const barPx = Math.max(18, Math.round((d.value / max) * chartHeight));

          return (
            <Stack key={d.label} alignItems="center" spacing={1.2}>
              <Typography sx={{ fontWeight: 900 }}>{d.value}</Typography>

              <Box
                sx={{
                  width: "100%",
                  height: chartHeight,
                  display: "flex",
                  alignItems: "flex-end",
                }}
              >
                <Box
                  sx={{
                    width: { xs: 42, sm: "100%" },
                    height: barPx,
                    borderRadius: 2,
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: `linear-gradient(180deg, ${d.color}, rgba(0,0,0,0.55))`,
                    boxShadow: `0 12px 34px ${d.color}33`,
                    mx: "auto",
                  }}
                />
              </Box>

              <Typography
                variant="caption"
                sx={{ color: "rgba(255,255,255,0.70)" }}
              >
                {d.label}
              </Typography>
            </Stack>
          );
        })}
      </Box>
    </Box>
  );
}

function CandleChart({
  title,
  subtitle,
  data,
}: {
  title: string;
  subtitle?: string;
  data: { label: string; value: number; color: string }[];
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const chartHeight = 240;

  return (
    <Box
      sx={{
        border: "1px solid rgba(255,255,255,0.10)",
        bgcolor: "rgba(15,15,18,0.38)",
        backdropFilter: "blur(10px)",
        borderRadius: 2,
        p: 2.25,
      }}
    >
      <Stack spacing={0.35} sx={{ mb: 2 }}>
        <Typography sx={{ fontWeight: 900 }}>{title}</Typography>
        {subtitle ? (
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.60)" }}>
            {subtitle}
          </Typography>
        ) : null}
      </Stack>

      <Box
        sx={{
          height: 340,
          display: "grid",
          gridTemplateColumns: {
            xs: `repeat(${data.length}, minmax(88px, 1fr))`,
            sm: `repeat(${data.length}, minmax(140px, 1fr))`,
            md: `repeat(${data.length}, minmax(160px, 1fr))`,
          },
          justifyContent: "center",
          gap: { xs: 3, sm: 6, md: 8 },
          alignItems: "end",
        }}
      >
        {data.map((d) => {
          const barPx = Math.max(18, Math.round((d.value / max) * chartHeight));

          return (
            <Stack key={d.label} alignItems="center" spacing={1.2}>
              <Typography sx={{ fontWeight: 900 }}>{d.value}</Typography>

              <Box
                sx={{
                  width: "100%",
                  height: chartHeight,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-end",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: { xs: "56%", sm: "70%", md: "78%" },
                    maxWidth: 260,
                    height: barPx,
                    minHeight: 26,
                  }}
                >
                  {/* wick */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: "50%",
                      top: -14,
                      bottom: -8,
                      width: 3,
                      transform: "translateX(-50%)",
                      bgcolor: `${d.color}55`,
                    }}
                  />

                  {/* body */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: "100%",
                      borderRadius: 2,
                      border: "1px solid rgba(255,255,255,0.10)",
                      background: `linear-gradient(180deg, ${d.color}, rgba(0,0,0,0.55))`,
                      boxShadow: `0 12px 34px ${d.color}33`,
                    }}
                  />
                </Box>
              </Box>

              <Typography
                variant="caption"
                sx={{ color: "rgba(255,255,255,0.70)" }}
              >
                {d.label}
              </Typography>
            </Stack>
          );
        })}
      </Box>
    </Box>
  );
}

export function StatsPanel({ stats }: { stats: Stats }) {
  const statusData = [
    {
      label: "Reservados",
      value: stats.reserved,
      color: "rgba(255,80,80,0.90)",
    },
    {
      label: "Pendientes",
      value: stats.pending,
      color: "rgba(255,210,70,0.92)",
    },
  ];

  const typeData = [
    {
      label: "Privados",
      value: stats.byType.Privado,
      color: "rgba(124,77,255,0.90)",
    },
    {
      label: "Clubs",
      value: stats.byType.Club,
      color: "rgba(70,220,255,0.88)",
    },
    {
      label: "Festivales",
      value: stats.byType.Festival,
      color: "rgba(255,160,70,0.90)",
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Stack spacing={2.5}>
        <Stack spacing={0.5}>
          <Typography variant="h6" sx={{ fontWeight: 950 }}>
            Estadísticas
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.62)" }}>
            Resumen de ocupación y distribución por tipo.
          </Typography>
        </Stack>

        {/* KPIs en una fila */}
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <Box
            sx={{
              minWidth: { xs: 720, md: 1200 },
              display: "grid",
              gap: 2,
              gridTemplateColumns: "repeat(6, 1fr)",
            }}
          >
            <StatCard
              label="TOTAL"
              value={stats.total}
              subtitle="eventos"
              glow="radial-gradient(420px 160px at 15% 10%, rgba(80,160,255,0.20), transparent 60%)"
              bar="rgba(80,160,255,0.70)"
            />
            <StatCard
              label="RESERVADOS"
              value={stats.reserved}
              subtitle="confirmados"
              glow="radial-gradient(420px 160px at 15% 10%, rgba(255,80,80,0.18), transparent 60%)"
              bar="rgba(255,80,80,0.75)"
            />
            <StatCard
              label="PENDIENTES"
              value={stats.pending}
              subtitle="por confirmar"
              glow="radial-gradient(420px 160px at 15% 10%, rgba(255,210,70,0.18), transparent 60%)"
              bar="rgba(255,210,70,0.80)"
            />
            <StatCard
              label="PRIVADOS"
              value={stats.byType.Privado}
              subtitle="bloques"
              glow="radial-gradient(420px 160px at 15% 10%, rgba(124,77,255,0.16), transparent 60%)"
              bar="rgba(124,77,255,0.70)"
            />
            <StatCard
              label="CLUBS"
              value={stats.byType.Club}
              subtitle="fechas"
              glow="radial-gradient(420px 160px at 15% 10%, rgba(70,220,255,0.14), transparent 60%)"
              bar="rgba(70,220,255,0.70)"
            />
            <StatCard
              label="FESTIVALES"
              value={stats.byType.Festival}
              subtitle="open air"
              glow="radial-gradient(420px 160px at 15% 10%, rgba(255,160,70,0.14), transparent 60%)"
              bar="rgba(255,160,70,0.75)"
            />
          </Box>
        </Box>

        {/* Charts más altos */}
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          }}
        >
          <VerticalBarChart
            title="Ocupación por status"
            subtitle="Reservados vs Pendientes"
            data={statusData}
          />
          <CandleChart
            title="Eventos por tipo"
            subtitle="Privado / Club / Festival"
            data={typeData}
          />
        </Box>
      </Stack>
    </motion.div>
  );
}
