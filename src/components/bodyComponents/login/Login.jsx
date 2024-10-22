import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    entId: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};
    if (!formData.entId) tempErrors.entId = "Enterprise ID is required";
    if (!formData.password) tempErrors.password = "Password is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (validate()) {
      setLoading(true);
      try {
        const response = await fetch("/api/gateway/entLogin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Login failed!");
        }

        const data = await response.json();
        setSuccessMessage(data.message || "Login successful!");

        // Handle Authentication Token
        if (data.token) {
          localStorage.setItem("authToken", data.token);
        }

        // Redirect to Dashboard or Protected Route
        navigate("/dashboard");
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        mt: 5,
        backgroundColor: "#f4f6f8",
        padding: 3,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 600, color: "#1976D2" }}
        >
          Enterprise Login
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
          Please enter your Enterprise ID and password
        </Typography>

        {/* Success Message */}
        {successMessage && (
          <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        {/* Error Message */}
        {errorMessage && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Box display="flex" flexDirection="column" gap="20px">
            <TextField
              label="Enterprise ID"
              variant="outlined"
              name="entId"
              value={formData.entId}
              onChange={handleChange}
              error={!!errors.entId}
              helperText={errors.entId}
              fullWidth
              sx={{ backgroundColor: "#fff" }}
              required
              aria-label="Enterprise ID"
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              fullWidth
              sx={{ backgroundColor: "#fff" }}
              required
              aria-label="Password"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ padding: 1.5 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}
