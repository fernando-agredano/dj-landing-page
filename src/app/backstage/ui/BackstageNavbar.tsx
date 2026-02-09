"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";

type NavKey = "agenda" | "stats";

export default function BackstageNavbar({
  active,
  onChange,
  onAgendar,
}: {
  active: NavKey;
  onChange: (key: NavKey) => void;
  onAgendar: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [loggingOut] = React.useState(false);
  const router = useRouter();

  function go(key: NavKey) {
    onChange(key);
    setOpen(false);
  }

  function agendar() {
    onAgendar();
    setOpen(false);
  }

  async function logout() {
    setOpen(false);

    try {
      await fetch("/api/backstage/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });
    } catch (err) {
      console.error("Error cerrando sesión", err);
    }

    router.replace("/backstage/login");
    router.refresh();
  }

  return (
    <AppBar
      position="sticky"
      color="transparent"
      sx={{
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Toolbar>
        {/* LOGO */}
        <Box sx={{ flexGrow: 1 }}>
          <Link
            href="/backstage"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <Image
                src="/images/logo-principal.png"
                alt="Biosfera Producción"
                width={46}
                height={46}
                priority
                style={{ opacity: 0.95 }}
              />

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  letterSpacing: 1,
                  lineHeight: 1,
                }}
              >
                BIOSFERA{" "}
                <Box component="span" sx={{ color: "#7c4dff" }}>
                  PRODUCCIÓN
                </Box>
              </Typography>
            </Box>
          </Link>
        </Box>

        {/* DESKTOP NAV */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
          <Button
            onClick={() => go("agenda")}
            sx={{
              fontWeight: 700,
              textTransform: "none",
              color: "rgba(255,255,255,0.88)",
              borderBottom:
                active === "agenda"
                  ? "2px solid rgba(124,77,255,0.9)"
                  : "2px solid transparent",
            }}
          >
            Agenda
          </Button>

          <Button
            onClick={() => go("stats")}
            sx={{
              fontWeight: 700,
              textTransform: "none",
              color: "rgba(255,255,255,0.88)",
              borderBottom:
                active === "stats"
                  ? "2px solid rgba(124,77,255,0.9)"
                  : "2px solid transparent",
            }}
          >
            Estadísticas
          </Button>

          <Button
            onClick={agendar}
            variant="contained"
            sx={{
              fontWeight: 800,
              textTransform: "none",
              borderRadius: 2,
              background:
                "linear-gradient(135deg, rgba(124,77,255,1), rgba(124,77,255,0.55))",
            }}
          >
            Agendar
          </Button>

          {/* ✅ LOGOUT */}
          <Button
            onClick={logout}
            startIcon={<LogoutIcon />}
            variant="outlined"
            disabled={loggingOut}
            sx={{
              fontWeight: 800,
              textTransform: "none",
              borderRadius: 2,
              color: "rgba(255,255,255,0.75)",
              borderColor: "rgba(255,255,255,0.12)",
              opacity: loggingOut ? 0.7 : 1,
            }}
          >
            {loggingOut ? "Saliendo..." : "Salir"}
          </Button>
        </Box>

        {/* MOBILE */}
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            display: { xs: "inline-flex", md: "none" },
            color: "rgba(255,255,255,0.85)",
          }}
        >
          <MenuIcon />
        </IconButton>

        <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
          <Box
            sx={{
              width: 280,
              height: "100%",
              bgcolor: "rgba(10,10,14,0.96)",
              borderLeft: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            <List>
              <ListItemButton onClick={() => go("agenda")}>
                <ListItemText primary="Agenda" />
              </ListItemButton>

              <ListItemButton onClick={() => go("stats")}>
                <ListItemText primary="Estadísticas" />
              </ListItemButton>

              <ListItemButton onClick={agendar}>
                <ListItemText primary="Agendar" />
              </ListItemButton>

              <Divider sx={{ opacity: 0.12, my: 1 }} />

              <ListItemButton onClick={logout} disabled={loggingOut}>
                <LogoutIcon sx={{ mr: 1.25, opacity: 0.8 }} />
                <ListItemText
                  primary={loggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
                />
              </ListItemButton>
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}
