import { useState } from "react";
import { TextField, Button, Box, Typography, Container } from "@mui/material";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!formData.username) tempErrors.username = "Username is required";
    if (!formData.password) tempErrors.password = "Password is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("Login successful!");
      setFormData({
        username: "",
        password: "",
      });
      setErrors({});
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
          Login
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
          Please enter your username and password
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Box display="flex" flexDirection="column" gap="20px">
            <TextField
              label="Username"
              variant="outlined"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              fullWidth
              sx={{ backgroundColor: "#fff" }}
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
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ padding: 1.5 }}
            >
              Login
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}
