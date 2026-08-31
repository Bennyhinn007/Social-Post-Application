import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0f4c5c",
    },
    secondary: {
      main: "#ff7f50",
    },
    background: {
      default: "#f7fbfc",
    },
  },
  typography: {
    fontFamily: '"Space Grotesk", "Trebuchet MS", sans-serif',
    h4: {
      letterSpacing: 0.2,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 12px 28px rgba(15, 76, 92, 0.12)",
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
