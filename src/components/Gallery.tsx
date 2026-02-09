"use client";

import * as React from "react";
import {
  Box,
  Stack,
  Typography,
  Card,
  CardActionArea,
  CardMedia,
  IconButton,
  Chip,
  Skeleton,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import { useTheme, useMediaQuery } from "@mui/material";

type MediaItem = {
  id: string;
  src: string;
  alt: string;
  href?: string;
  tag?: string;
};

const mockMedia: MediaItem[] = [
  { id: "m1", src: "/images/media-1.png", alt: "DJ set 1", tag: "Live" },
  { id: "m2", src: "/images/media-2.png", alt: "DJ set 2", tag: "Backstage" },
  { id: "m3", src: "/images/media-3.png", alt: "DJ set 3", tag: "Club" },
  { id: "m4", src: "/images/media-4.png", alt: "DJ set 4", tag: "Festival" },
  { id: "m5", src: "/images/media-5.png", alt: "DJ set 5", tag: "Night" },
  { id: "m6", src: "/images/media-6.png", alt: "DJ set 6", tag: "Live" },
];

function MediaCard({ item, isBig }: { item: MediaItem; isBig: boolean }) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        border: "1px solid rgba(255,255,255,0.10)",
        bgcolor: "rgba(15,15,18,0.45)",
        backdropFilter: "blur(6px)",
        overflow: "hidden",
      }}
    >
      <CardActionArea
        component="a"
        href={item.href ?? "#"}
        onClick={(e) => {
          if (!item.href) e.preventDefault();
        }}
      >
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            image={item.src}
            alt={item.alt}
            sx={{
              height: {
                xs: 260,
                sm: isBig ? 520 : 300,
                md: isBig ? 540 : 320,
              },

              objectFit: "cover",
              filter: "contrast(1.05) saturate(1.05)",
            }}
          />

          {item.tag ? (
            <Chip
              label={item.tag}
              size="small"
              sx={{
                position: "absolute",
                top: 12,
                left: 12,
                bgcolor: "rgba(0,0,0,0.55)",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "rgba(255,255,255,0.92)",
              }}
            />
          ) : null}
        </Box>
      </CardActionArea>
    </Card>
  );
}

function MediaCardSkeleton({ isBig }: { isBig: boolean }) {
  const h = {
    xs: 320,
    sm: isBig ? 520 : 300,
    md: isBig ? 540 : 320,
  } as const;

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        border: "1px solid rgba(255,255,255,0.10)",
        bgcolor: "rgba(15,15,18,0.45)",
        backdropFilter: "blur(6px)",
        overflow: "hidden",
      }}
    >
      <Box sx={{ position: "relative" }}>
        {/* Imagen” skeleton */}
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            height: h,
            bgcolor: "rgba(255,255,255,0.06)",
          }}
        />

        {/* Chip skeleton */}
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            width: 70,
            height: 24,
            bgcolor: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        />
      </Box>
    </Card>
  );
}

export default function Gallery() {
  const [items, setItems] = React.useState<MediaItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  React.useEffect(() => {
    // Simulación de carga (para ver skeleton)
    // Si luego tienes API, reemplaza esto por fetch() real.
    const t = setTimeout(() => {
      setItems(mockMedia);
      setLoading(false);
    }, 650);

    return () => clearTimeout(t);
  }, []);

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
      {/* grano sutil */}
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
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2, position: "relative", zIndex: 1 }}
      >
        <Stack spacing={1.2} sx={{ mb: 3, position: "relative", zIndex: 1 }}>
          <Stack direction="row" spacing={1.2} alignItems="center">
            <PhotoLibraryIcon sx={{ opacity: 0.9 }} />

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
                MEDIA
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 200,
                  lineHeight: 1.02,
                  fontSize: 30,
                }}
              >
                Galería de Imágenes y Videos
              </Typography>
            </Stack>
          </Stack>

          <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
            Momentos del set, backstage y gigs.
          </Typography>
        </Stack>

        <IconButton
          component="a"
          href="https://www.instagram.com/biosfera_produccion/"
          target="_blank"
          rel="noreferrer"
          sx={{
            border: "1px solid rgba(255,255,255,0.12)",
            bgcolor: "rgba(0,0,0,0.20)",
          }}
        >
          <InstagramIcon />
        </IconButton>
      </Stack>

      {/* Grid tipo editorial */}
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gridAutoFlow: "dense",
          }}
        >
          {loading
            ? // Skeletons (misma lógica de “big cards”)
              Array.from({ length: 6 }).map((_, idx) => {
                const isBig = idx === 0 || idx === 3;
                return (
                  <Box
                    key={`sk_${idx}`}
                    sx={{
                      gridColumn: isBig ? "span 2" : "span 1",
                      gridRow: isBig ? "span 2" : "span 1",
                    }}
                  >
                    <MediaCardSkeleton isBig={isBig} />
                  </Box>
                );
              })
            : items.map((item, idx) => {
                const isBig = !isMobile && (idx === 0 || idx === 3);
                return (
                  <Box
                    key={item.id}
                    sx={{
                      gridColumn: isBig ? "span 2" : "span 1",
                      gridRow: isBig ? "span 2" : "span 1",
                    }}
                  >
                    <MediaCard item={item} isBig={isBig} />
                  </Box>
                );
              })}
        </Box>
      </Box>
    </Box>
  );
}
