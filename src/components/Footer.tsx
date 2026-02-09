"use client";

import * as React from "react";
import Image from "next/image";
import {
  Box,
  Container,
  IconButton,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import EmailIcon from "@mui/icons-material/Email";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        borderTop: "1px solid rgba(255,255,255,0.08)",
        background:
          "radial-gradient(900px 320px at 20% 0%, rgba(255,255,255,0.06), transparent 60%)," +
          "radial-gradient(800px 280px at 85% 20%, rgba(255,255,255,0.05), transparent 55%)," +
          "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.0))",
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 5 } }}>
        <Stack spacing={2.5}>
          {/* Top */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            spacing={2}
          >
            {/* Brand */}
            <Stack direction="row" spacing={1.4} alignItems="center">
              {/* Cambia esta ruta por tu logo real */}
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  position: "relative",
                  opacity: 0.92,
                }}
              >
                <Image
                  src="/images/logo-principal.png"
                  alt="Biosfera Producción"
                  fill
                  style={{ objectFit: "contain" }}
                  priority={false}
                />
              </Box>

              <Stack spacing={0.1}>
                <Typography
                  sx={{
                    fontWeight: 900,
                    letterSpacing: 1.2,
                    lineHeight: 1.05,
                    textTransform: "uppercase",
                  }}
                >
                  BIOSFERA{" "}
                  <Box component="span" sx={{ opacity: 0.75 }}>
                    PRODUCCIÓN
                  </Box>
                </Typography>

                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255,255,255,0.55)", letterSpacing: 2 }}
                >
                  © {year} · Todos los derechos reservados
                </Typography>
              </Stack>
            </Stack>

            {/* Social */}
            <Stack direction="row" spacing={1}>
              <IconButton
                component="a"
                href="https://www.instagram.com/biosfera_produccion/"
                target="_blank"
                rel="noreferrer"
                sx={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  bgcolor: "rgba(0,0,0,0.20)",
                  backdropFilter: "blur(6px)",
                }}
              >
                <InstagramIcon />
              </IconButton>

              <IconButton
                component="a"
                href="mailto:produccionesbiosfera@gmail.com"
                target="_blank"
                rel="noreferrer"
                sx={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  bgcolor: "rgba(0,0,0,0.20)",
                  backdropFilter: "blur(6px)",
                }}
              >
                <EmailIcon />
              </IconButton>

              <IconButton
                component="a"
                href="https://www.facebook.com/share/1GsF9Zkiru/?mibextid=wwXIfr"
                target="_blank"
                rel="noreferrer"
                sx={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  bgcolor: "rgba(0,0,0,0.20)",
                  backdropFilter: "blur(6px)",
                }}
              >
                <FacebookIcon />
              </IconButton>
            </Stack>
          </Stack>

          <Divider sx={{ opacity: 0.14 }} />

          {/* Bottom line */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            spacing={1}
          >
            <Typography
              variant="caption"
              sx={{ color: "rgba(255,255,255,0.55)" }}
            >
              BIOSFERA PRODUCCIÓN
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
