"use client";

import { Box, Container, Stack, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { scrollToElement } from "@/lib/scroll";

export default function Hero() {
  return (
    <Box
      component="section"
      id="inicio"
      sx={{
        position: "relative",
        p: 0,
        minHeight: { xs: "calc(100svh - 64px)", md: "calc(100svh - 65px)" },
        display: "grid",
        alignItems: "center",
        backgroundImage:
          "linear-gradient(rgba(11,11,15,0.65), rgba(11,11,15,0.9)), url(/images/secondary-image.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        "&::after": {
          content: '""',
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 80,
          pointerEvents: "none",
          background:
            "linear-gradient(to bottom, rgba(11,11,15,0), rgba(11,11,15,1))",
        },
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
        <Stack
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          spacing={3}
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Typography
            variant="h1"
            sx={{ fontSize: { xs: 42, md: 72 }, lineHeight: 1.05 }}
          >
            BIOSFERA <span style={{ color: "#7c4dff" }}>PRODUCCIÓN</span>
          </Typography>

          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ maxWidth: 780 }}
          >
            Beats electrónicos, tech house y vibes nocturnas. Disponible para
            festivales, clubs y eventos privados.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              variant="contained"
              onClick={() =>
                scrollToElement("agenda", {
                  offset: 58, // altura navbar
                  duration: 300, // velocidad
                })
              }
            >
              Ver Agenda
            </Button>

            <Button
              variant="outlined"
              onClick={() =>
                scrollToElement("contacto", {
                  offset: 58,
                  duration: 300,
                })
              }
              sx={{
                borderWidth: 2,
                boxShadow: "0 0 8px rgba(124, 77, 255, 0.7)",
              }}
            >
              Reservar fecha
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
