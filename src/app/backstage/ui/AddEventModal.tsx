"use client";

import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
  IconButton,
  Button,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

export type EventStatus = "Reservado" | "Tentativo";
export type EventType = "Club" | "Festival" | "Privado";

export type DJEvent = {
  id: string;
  status: EventStatus;
  type: EventType;
  date: string;
  startTime: string;
  title: string;
  venue: string;
  city: string;
};

type FormState = Omit<DJEvent, "id">;

export function AddEventModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormState) => void;
}) {
  const [form, setForm] = React.useState<FormState>(() => ({
    status: "Reservado",
    type: "Club",
    date: new Date().toISOString().slice(0, 10),
    startTime: "21:00",
    title: "",
    venue: "",
    city: "",
  }));

  // Toast state
  const [toastOpen, setToastOpen] = React.useState(false);
  const [toastMsg, setToastMsg] = React.useState<string>("");
  const [toastSeverity, setToastSeverity] = React.useState<
    "error" | "success" | "info" | "warning"
  >("error");

  function showToast(
    message: string,
    severity: "error" | "success" | "info" | "warning" = "error",
  ) {
    setToastMsg(message);
    setToastSeverity(severity);
    setToastOpen(true);
  }

  React.useEffect(() => {
    if (open) {
      setForm({
        status: "Reservado",
        type: "Club",
        date: new Date().toISOString().slice(0, 10),
        startTime: "21:00",
        title: "",
        venue: "",
        city: "",
      });
      // Reset toast al abrir
      setToastOpen(false);
      setToastMsg("");
      setToastSeverity("error");
    }
  }, [open]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function validate(): string | null {
    if (!form.date) return "La fecha es obligatoria.";
    if (!form.startTime) return "La hora de inicio es obligatoria.";
    if (!form.city.trim()) return "La ciudad es obligatoria.";

    if (form.type !== "Privado") {
      if (!form.title.trim()) return "El título es obligatorio.";
      if (!form.venue.trim()) return "El lugar es obligatorio.";
    }
    return null;
  }

  function submit() {
    const err = validate();
    if (err) {
      showToast(err, "error");
      return;
    }

    onSubmit({
      ...form,
      title: form.type === "Privado" ? "Evento Privado" : form.title.trim(),
      venue: form.type === "Privado" ? "" : form.venue.trim(),
      city: form.city.trim(),
    });
    showToast("Evento listo para guardar.", "success");
  }

  const isPrivate = form.type === "Privado";
  const fieldSx = {
    "& .MuiInputBase-root": {
      bgcolor: "rgba(255,255,255,0.04)",
      borderRadius: 2,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255,255,255,0.10)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255,255,255,0.14)",
    },
    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(138,92,255,0.65)",
    },
    "& .MuiInputLabel-root": {
      color: "rgba(255,255,255,0.60)",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "rgba(138,92,255,0.85)",
    },
    "& input, & textarea": {
      color: "rgba(255,255,255,0.90)",
    },
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2,
            border: "1px solid rgba(255,255,255,0.10)",
            bgcolor: "rgba(6,6,9,0.96)",
            backgroundImage:
              "radial-gradient(900px 320px at 20% 0%, rgba(138,92,255,0.10), transparent 55%)," +
              "radial-gradient(900px 320px at 85% 10%, rgba(255,255,255,0.05), transparent 60%)," +
              "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(0,0,0,0.0))",
            backdropFilter: "blur(10px)",
            boxShadow: "0 34px 120px rgba(0,0,0,0.75)",
            overflow: "hidden",
            position: "relative",
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
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0,0,0,0.70)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2,
            pb: 1,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Stack spacing={0.4}>
            <Typography sx={{ fontWeight: 900, letterSpacing: -0.2 }}>
              AGREGAR EVENTO
            </Typography>
          </Stack>

          <IconButton
            onClick={onClose}
            sx={{ color: "rgba(255,255,255,0.75)" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ position: "relative", zIndex: 1 }}>
          <Stack spacing={2}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              paddingTop={1}
            >
              <TextField
                select
                label="Status"
                value={form.status}
                onChange={(e) => set("status", e.target.value as EventStatus)}
                fullWidth
                sx={fieldSx}
              >
                <MenuItem value="Reservado">Reservado</MenuItem>
                <MenuItem value="Tentativo">Pendiente</MenuItem>
              </TextField>

              <TextField
                select
                label="Tipo"
                value={form.type}
                onChange={(e) => set("type", e.target.value as EventType)}
                fullWidth
                sx={fieldSx}
              >
                <MenuItem value="Club">Club</MenuItem>
                <MenuItem value="Festival">Festival</MenuItem>
                <MenuItem value="Privado">Privado</MenuItem>
              </TextField>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Fecha"
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={fieldSx}
              />
              <TextField
                label="Hora inicio"
                type="time"
                value={form.startTime}
                onChange={(e) => set("startTime", e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={fieldSx}
              />
            </Stack>

            <TextField
              label={isPrivate ? "Título (se ocultará)" : "Título / Nombre"}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              fullWidth
              placeholder={
                isPrivate ? "Evento Privado" : "After Hours, Deep Vibes..."
              }
              disabled={isPrivate}
              sx={fieldSx}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label={isPrivate ? "Lugar (se oculta)" : "Lugar"}
                value={form.venue}
                onChange={(e) => set("venue", e.target.value)}
                fullWidth
                placeholder={isPrivate ? "—" : "Luna Club, Warehouse 44..."}
                disabled={isPrivate}
                sx={fieldSx}
              />
              <TextField
                label="Ciudad"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                fullWidth
                placeholder="CDMX, Monterrey..."
                sx={fieldSx}
              />
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 1.2, position: "relative", zIndex: 1 }}>
          <Button
            onClick={onClose}
            sx={{
              borderRadius: 999,
              textTransform: "none",
              color: "rgba(255,255,255,0.75)",
              border: "1px solid rgba(255,255,255,0.10)",
              bgcolor: "rgba(255,255,255,0.03)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
            }}
          >
            Cancelar
          </Button>

          <Button
            onClick={submit}
            startIcon={<AddIcon />}
            sx={{
              borderRadius: 999,
              px: 2.2,
              textTransform: "none",
              fontWeight: 900,
              color: "white",
              border: "1px solid rgba(255,255,255,0.10)",
              background:
                "linear-gradient(135deg, rgba(138,92,255,1), rgba(138,92,255,0.55))",
              boxShadow:
                "0 14px 38px rgba(138,92,255,0.22), inset 0 1px 0 rgba(255,255,255,0.14)",
              "&:hover": { filter: "brightness(1.05)" },
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast (Snackbar) */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={2400}
        onClose={(_, reason) => {
          if (reason === "clickaway") return;
          setToastOpen(false);
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity={toastSeverity}
          variant="filled"
          sx={{
            borderRadius: 2,
            fontWeight: 800,
            bgcolor:
              toastSeverity === "error"
                ? "rgba(255,77,63,0.95)"
                : toastSeverity === "success"
                  ? "rgba(138,92,255,0.90)"
                  : "rgba(20,20,24,0.92)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 18px 60px rgba(0,0,0,0.55)",
          }}
        >
          {toastMsg}
        </Alert>
      </Snackbar>
    </>
  );
}
