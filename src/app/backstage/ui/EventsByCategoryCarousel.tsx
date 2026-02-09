"use client";

import * as React from "react";
import {
  Box,
  Stack,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import type { DJEvent } from "./AddEventModal";
import { EventsGrid } from "./EventsGrid";

type Category = "priv" | "club" | "fest";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function EventsByCategoryCarousel({
  grouped,
  onDelete,
}: {
  grouped: { priv: DJEvent[]; club: DJEvent[]; fest: DJEvent[] };
  onDelete: (ev: DJEvent) => void;
}) {
  const [cat, setCat] = React.useState<Category>("priv");

  const current = React.useMemo(() => {
    if (cat === "priv") return { title: "Privados", events: grouped.priv };
    if (cat === "club") return { title: "Clubs", events: grouped.club };
    return { title: "Festivales", events: grouped.fest };
  }, [cat, grouped]);

  return (
    <Stack spacing={2} sx={{ width: "100%", alignItems: "stretch" }}>
      {/* Selector */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <ToggleButtonGroup
          value={cat}
          exclusive
          onChange={(_, v) => v && setCat(v)}
          sx={{
            bgcolor: "rgba(15,15,18,0.35)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 999,
            p: 0.5,
            "& .MuiToggleButton-root": {
              border: 0,
              color: "rgba(255,255,255,0.70)",
              borderRadius: 999,
              px: 2,
              py: 0.8,
              textTransform: "none",
              fontWeight: 800,
              fontSize: 14,
            },
            "& .Mui-selected": {
              color: "rgba(255,255,255,0.95)",
              bgcolor: "rgba(255,255,255,0.10)",
            },
          }}
        >
          <ToggleButton value="priv">Privados</ToggleButton>
          <ToggleButton value="club">Clubs</ToggleButton>
          <ToggleButton value="fest">Festivales</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ width: "100%", px: { xs: 0, md: 0 } }}>
          <Typography
            variant="caption"
            sx={{
              color: "rgba(255,255,255,0.45)",
              display: "block",
              mb: 1,
              textAlign: "left",
            }}
          >
            {current.title}: {current.events.length} eventos
          </Typography>

          <Box sx={{ width: "100%", minHeight: 260 }}>
            <AnimatePresence mode="wait">
              <Box
                key={cat}
                component={motion.div}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22, ease: EASE_OUT }}
                sx={{ width: "100%" }}
              >
                {current.events.length === 0 ? (
                  <Box
                    sx={{
                      width: "100%",
                      border: "1px solid rgba(255,255,255,0.10)",
                      bgcolor: "rgba(15,15,18,0.38)",
                      backdropFilter: "blur(10px)",
                      borderRadius: 2,
                      p: 2.25,
                      textAlign: "center",
                      display: "grid",
                      placeItems: "center",
                      minHeight: 120,
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 900, mb: 0.5 }}>
                        No hay eventos en {current.title}
                      </Typography>
                      <Typography sx={{ color: "rgba(255,255,255,0.62)" }}>
                        Agrega uno con “Agendar” o cambia de categoría.
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <EventsGrid
                    title={current.title}
                    events={current.events}
                    onDelete={onDelete}
                  />
                )}
              </Box>
            </AnimatePresence>
          </Box>
        </Box>
      </Box>
    </Stack>
  );
}
