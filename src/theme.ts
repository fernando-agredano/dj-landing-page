"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
  mode: "dark",
  primary: { main: "#8B5CF6" },
  secondary: { main: "#A1A1AA" }, 
},
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily:
      "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    h1: { fontWeight: 800, letterSpacing: -0.5 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
  },
  components: {
    MuiButton: {
      defaultProps: {
        size: "large",
      },
    },
  },
});

export default theme;
