"use client";

import * as React from "react";
import {
  Box,
  Stack,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  Divider,
  Skeleton,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: 2,
          display: "grid",
          placeItems: "center",
          border: "1px solid rgba(255,255,255,0.10)",
          bgcolor: "rgba(0,0,0,0.20)",
          backdropFilter: "blur(6px)",
        }}
      >
        {icon}
      </Box>

      <Stack spacing={0.2} sx={{ minWidth: 0 }}>
        <Typography
          variant="overline"
          sx={{ letterSpacing: 2.2, opacity: 0.75 }}
        >
          {label}
        </Typography>

        {href ? (
          <Typography
            component="a"
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noreferrer" : undefined}
            sx={{
              color: "rgba(255,255,255,0.92)",
              fontWeight: 800,
              textDecoration: "none",
              "&:hover": { opacity: 0.85 },
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {value}
          </Typography>
        ) : (
          <Typography sx={{ color: "rgba(255,255,255,0.92)", fontWeight: 800 }}>
            {value}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}

function ContactRowSkeleton() {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Skeleton
        variant="rounded"
        animation="wave"
        sx={{
          width: 56,
          height: 56,
          borderRadius: 2,
          bgcolor: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.10)",
        }}
      />

      <Stack spacing={0.7} sx={{ flex: 1, minWidth: 0 }}>
        <Skeleton
          variant="text"
          animation="wave"
          sx={{ width: 110, bgcolor: "rgba(255,255,255,0.06)" }}
        />
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: "70%",
            maxWidth: 280,
            bgcolor: "rgba(255,255,255,0.06)",
          }}
        />
      </Stack>
    </Stack>
  );
}

function FormSkeleton() {
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid rgba(255,255,255,0.10)",
        bgcolor: "rgba(15,15,18,0.45)",
        backdropFilter: "blur(6px)",
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Stack spacing={2}>
          <Skeleton
            variant="rounded"
            animation="wave"
            sx={{
              height: 56,
              borderRadius: 2,
              bgcolor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          />
          <Skeleton
            variant="rounded"
            animation="wave"
            sx={{
              height: 56,
              borderRadius: 2,
              bgcolor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          />
          <Skeleton
            variant="rounded"
            animation="wave"
            sx={{
              height: 140,
              borderRadius: 2,
              bgcolor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          />

          <Divider sx={{ opacity: 0.18 }} />

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Skeleton
                variant="rounded"
                animation="wave"
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: 2,
                  bgcolor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
              />
              <Skeleton
                variant="text"
                animation="wave"
                sx={{ width: 170, bgcolor: "rgba(255,255,255,0.06)" }}
              />
            </Stack>

            <Skeleton
              variant="rounded"
              animation="wave"
              sx={{
                width: 150,
                height: 46,
                borderRadius: 2,
                bgcolor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function Contact() {
  const [loadingForm, setLoadingForm] = React.useState(false);
  const [loadingSection, setLoadingSection] = React.useState(true);

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    const t = setTimeout(() => setLoadingSection(false), 450);
    return () => clearTimeout(t);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    setLoadingForm(true);
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      });

      const j = await r.json().catch(() => null);

      if (!r.ok || !j?.ok) {
        throw new Error(j?.error || "No se pudo enviar el mensaje.");
      }

      setSuccessMsg("¡Listo! Tu mensaje se envió correctamente.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      setErrorMsg(err?.message || "No se pudo enviar el mensaje.");
    } finally {
      setLoadingForm(false);
    }
  };

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
        {loadingSection ? (
          <Stack spacing={0.8}>
            <Skeleton
              variant="text"
              animation="wave"
              sx={{ width: 120, bgcolor: "rgba(255,255,255,0.06)" }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                width: 420,
                maxWidth: "85%",
                bgcolor: "rgba(255,255,255,0.06)",
              }}
            />
          </Stack>
        ) : (
          <Stack direction="row" spacing={1.2} alignItems="center">
            <MailOutlineIcon sx={{ opacity: 0.9 }} />
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
                CONTACTO
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 200,
                  lineHeight: 1.02,
                  fontSize: 30,
                }}
              >
                Comunicate para mas información
              </Typography>
            </Stack>
          </Stack>
        )}
      </Stack>

      <Grid
        container
        spacing={3}
        columns={{ xs: 12, md: 12 }}
        sx={{ position: "relative", zIndex: 1 }}
      >
        {/* Left */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={3}>
            {loadingSection ? (
              <>
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{ width: "92%", bgcolor: "rgba(255,255,255,0.06)" }}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{ width: "84%", bgcolor: "rgba(255,255,255,0.06)" }}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{ width: "78%", bgcolor: "rgba(255,255,255,0.06)" }}
                />

                <Stack spacing={2.25} sx={{ mt: 1 }}>
                  <ContactRowSkeleton />
                  <ContactRowSkeleton />
                  <ContactRowSkeleton />
                  <ContactRowSkeleton />
                </Stack>
              </>
            ) : (
              <>
                <Typography color="text.secondary" sx={{ maxWidth: 520 }}>
                  Para bookings, colaboraciones o cualquier consulta, no dudes
                  en contactar. Siempre abierto a nuevos proyectos y
                  experiencias sonoras.
                </Typography>

                <Stack spacing={2.25}>
                  <ContactRow
                    icon={<InstagramIcon />}
                    label="INSTAGRAM"
                    value="Luz y Sonido Biosfera Producciónes"
                    href="https://www.instagram.com/biosfera_produccion/"
                  />
                  <ContactRow
                    icon={<FacebookIcon />}
                    label="FACEBOOK"
                    value="Luz y Sonido Biosfera Producciónes"
                    href="https://www.facebook.com/share/1GsF9Zkiru/?mibextid=wwXIfr"
                  />
                  <ContactRow
                    icon={<EmailIcon />}
                    label="Email"
                    value="produccionesbiosfera@gmail.com"
                  />
                  <ContactRow
                    icon={<PhoneIcon />}
                    label="Enrique Orozco"
                    value="3322971085"
                  />
                </Stack>
              </>
            )}
          </Stack>
        </Grid>

        {/* Right */}
        <Grid size={{ xs: 12, md: 7 }}>
          {loadingSection ? (
            <FormSkeleton />
          ) : (
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid rgba(255,255,255,0.10)",
                bgcolor: "rgba(15,15,18,0.45)",
                backdropFilter: "blur(6px)",
                overflow: "hidden",
              }}
            >
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Stack component="form" onSubmit={onSubmit} spacing={2}>
                  {successMsg ? (
                    <Alert severity="success">{successMsg}</Alert>
                  ) : null}
                  {errorMsg ? <Alert severity="error">{errorMsg}</Alert> : null}

                  <Stack
                    spacing={2}
                    sx={{
                      "& .MuiInputBase-root": {
                        bgcolor: "rgba(0,0,0,0.22)",
                        borderRadius: 2,
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255,255,255,0.10)",
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255,255,255,0.55)",
                        letterSpacing: 2,
                      },
                    }}
                  >
                    <TextField
                      label="NOMBRE"
                      placeholder="Tu nombre"
                      fullWidth
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      disabled={loadingForm}
                    />

                    <TextField
                      label="EMAIL"
                      placeholder="tu@email.com"
                      type="email"
                      fullWidth
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      disabled={loadingForm}
                    />

                    <TextField
                      label="MENSAJE"
                      placeholder="Tu mensaje..."
                      fullWidth
                      required
                      multiline
                      minRows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      disabled={loadingForm}
                    />
                  </Stack>

                  <Divider sx={{ opacity: 0.18 }} />

                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ pt: 1 }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <IconButton
                        component="a"
                        href="mailto:produccionesbiosfera@gmail.com"
                        sx={{
                          border: "1px solid rgba(255,255,255,0.12)",
                          bgcolor: "rgba(0,0,0,0.20)",
                        }}
                      >
                        <EmailIcon fontSize="small" />
                      </IconButton>
                      <Typography variant="caption" color="text.secondary">
                        Respondo en 24–48h
                      </Typography>
                    </Stack>

                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loadingForm}
                      sx={{
                        px: 4,
                        py: 1.4,
                        fontWeight: 900,
                        letterSpacing: 1.5,
                        borderRadius: 2,
                      }}
                    >
                      {loadingForm ? "ENVIANDO..." : "ENVIAR"}
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
