"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { scrollToElement } from "@/lib/scroll";

const nav = [
  { label: "Inicio", href: "#inicio" },
  { label: "Agenda", href: "#agenda" },
  { label: "Media", href: "#media" },
];

export default function Navbar() {
  const [open, setOpen] = React.useState(false);

  const handleNavClick =
    (href: string) => (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();

      const id = href.replace("#", "");
      scrollToElement(id, {
        offset: 58,
        duration: 300,
      });

      setOpen(false);
    };

  return (
    <AppBar
      position="sticky"
      color="transparent"
      sx={{
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Link
            href="#inicio"
            onClick={handleNavClick("#inicio")}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <Image
                src="/images/logo-principal.png"
                alt="Biosfera Producción"
                width={50}
                height={50}
                priority
                style={{ opacity: 0.95 }}
              />
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, letterSpacing: 1, lineHeight: 1 }}
              >
                BIOSFERA{" "}
                <Box component="span" sx={{ color: "#7c4dff" }}>
                  PRODUCCIÓN
                </Box>
              </Typography>
            </Box>
          </Link>
        </Box>

        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
          {nav.map((item) => (
            <Button
              key={item.href}
              component="a"
              href={item.href}
              onClick={handleNavClick(item.href)}
              variant="text"
            >
              {item.label}
            </Button>
          ))}
          <Button
            component="a"
            href="#contacto"
            onClick={handleNavClick("#contacto")}
            variant="contained"
          >
            Reservar
          </Button>
        </Box>

        <IconButton
          onClick={() => setOpen(true)}
          sx={{ display: { xs: "inline-flex", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
          <Box sx={{ width: 260 }} role="presentation">
            <List>
              {nav.map((item) => (
                <ListItemButton
                  key={item.href}
                  component="a"
                  href={item.href}
                  onClick={handleNavClick(item.href)}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              ))}
              <ListItemButton
                component="a"
                href="#contacto"
                onClick={handleNavClick("#contacto")}
              >
                <ListItemText primary="Reservar" />
              </ListItemButton>
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}
