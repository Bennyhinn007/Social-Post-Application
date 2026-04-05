import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", form);
      login(response.data);
      navigate("/feed", { replace: true });
    } catch (apiError) {
      if (!apiError?.response) {
        setError(
          "Cannot reach the server. Make sure backend is running and CORS allows this frontend origin.",
        );
        return;
      }

      setError(
        apiError?.response?.data?.message || "Unable to login right now.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ minHeight: "100vh", display: "grid", placeItems: "center", py: 4 }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          background:
            "linear-gradient(145deg, #fff7ec 0%, #fff 45%, #f1f8ff 100%)",
        }}
      >
        <Stack spacing={3} component="form" onSubmit={handleSubmit}>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Welcome back
            </Typography>
            <Typography color="text.secondary">
              Sign in to your social feed.
            </Typography>
          </Box>

          {error ? <Alert severity="error">{error}</Alert> : null}

          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </Button>

          <Typography color="text.secondary">
            Do not have an account?{" "}
            <Link component={RouterLink} to="/signup">
              Create one
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Login;
