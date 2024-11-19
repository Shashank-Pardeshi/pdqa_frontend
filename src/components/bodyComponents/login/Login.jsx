import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Navbar from "../../LandingPage/Navbar/Navbar";

export default function Login() {
  const [formData, setFormData] = useState({
    enterpriseLoginId: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    // Only perform backend validation
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/gateway/login`, {
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
      console.log(data);
      console.log(data.enterpriseRecord.id);

      // Save the relevant data to local storage
      localStorage.setItem("enterpriseId", data.enterpriseRecord.id);
      // localStorage.setItem("enterpriseDescription", data.enterpriseDescription);
      localStorage.setItem(
        "listOfStoreDetails",
        JSON.stringify(data.enterpriseRecord.listOfStores)
      );

      // Handle Authentication Token
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }

      // Redirect to Dashboard or Protected Route

      navigate("/home");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  return (
    <>
      <Navbar></Navbar>
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
                name="enterpriseLoginId"
                value={formData.enterpriseLoginId}
                onChange={handleChange}
                fullWidth
                sx={{ backgroundColor: "#fff" }}
                required
                aria-label="Enterprise ID"
              />
              <TextField
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                sx={{ backgroundColor: "#fff" }}
                required
                aria-label="Password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={toggleShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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

              {/* New Button to Redirect to Registration Page */}
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                sx={{ padding: 1.5 }}
                onClick={handleRegisterRedirect}
              >
                Not Registered? Register Here
              </Button>
            </Box>
          </form>
        </Box>
      </Container>
    </>
  );
}
