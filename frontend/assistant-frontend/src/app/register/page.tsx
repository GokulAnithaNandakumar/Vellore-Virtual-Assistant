"use client";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        setSuccess("Registration successful! Please login.");
        setTimeout(() => router.push("/login"), 1500);
      } else if (res.status === 400) {
        let message = "Username already exists";
        try {
          const data = await res.json();
          message = data.message || message;
        } catch {
          // If not JSON, keep default message
        }
        setError(message);
        setOpen(true);
      } else {
        let message = "Registration failed";
        try {
          const data = await res.json();
          message = data.message || message;
        } catch {
          // If not JSON, keep default message
        }
        setError(message);
        setOpen(true);
      }
    } catch (err: any) {
      // Try to extract backend error message if available
      if (err instanceof Response) {
        try {
          const data = await err.json();
          setError(data.message || "Network error");
        } catch {
          setError("Network error");
        }
      } else if (err && err.message) {
        setError(err.message);
      } else {
        setError("Network error");
      }
      setOpen(true);
    }
  };

  return (
    <Container maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          mt: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
          <LockOutlined />
        </Avatar>
        <Typography variant="h5">Register</Typography>
        <Box component="form" onSubmit={handleRegister} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {success && <Typography color="success.main" sx={{ mt: 1 }}>{success}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Link href="/login">Already have an account? Login</Link>
          </Box>
          <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert onClose={() => setOpen(false)} severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </Container>
  );
}
