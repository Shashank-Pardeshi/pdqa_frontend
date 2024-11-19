import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Grid,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Navbar from "../../LandingPage/Navbar/Navbar";

export default function Register() {
  const [formData, setFormData] = useState({
    enterpriseName: "",
    enterpriseDescription: "",
    numberOfStores: "",
    storeDetails: [], // Will contain pairs for each store {inventoryCounters: int, billingCounters: int}
    enterprisePassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Loading state
  const [successMessage, setSuccessMessage] = useState(""); // Success feedback
  const [errorMessage, setErrorMessage] = useState(""); // Error feedback
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility

  const navigate = useNavigate(); // Initialize navigate

  // Validation function
  const validate = () => {
    let tempErrors = {};

    // Enterprise Name validation (alphabets only)
    const namePattern = /^[A-Za-z]+$/;
    if (!formData.enterpriseName.trim()) {
      tempErrors.enterpriseName = "Enterprise Name is required";
    } else if (!namePattern.test(formData.enterpriseName.trim())) {
      tempErrors.enterpriseName =
        "Enterprise Name should only contain alphabets";
    }

    // Enterprise Description validation (alphanumeric only)
    const descriptionPattern = /^[A-Za-z0-9\s]+$/;
    if (!formData.enterpriseDescription.trim()) {
      tempErrors.enterpriseDescription = "Enterprise Description is required";
    } else if (
      !descriptionPattern.test(formData.enterpriseDescription.trim())
    ) {
      tempErrors.enterpriseDescription =
        "Enterprise Description should be alphanumeric";
    }

    // Password validation (at least 8 characters)
    if (!formData.enterprisePassword.trim()) {
      tempErrors.enterprisePassword = "Enterprise Password is required";
    } else if (formData.enterprisePassword.length < 8) {
      tempErrors.enterprisePassword =
        "Password must be at least 8 characters long";
    }

    // Number of Stores validation (numeric and > 0)
    if (formData.numberOfStores === "") {
      tempErrors.numberOfStores = "Number of Stores is required";
    } else if (
      isNaN(formData.numberOfStores) ||
      parseInt(formData.numberOfStores, 10) <= 0
    ) {
      tempErrors.numberOfStores =
        "Enter a valid number of stores greater than 0";
    }

    // Store Details validation
    if (formData.storeDetails.length > 0) {
      formData.storeDetails.forEach((store, index) => {
        if (
          store.billingCounters === "" ||
          isNaN(store.billingCounters) ||
          parseInt(store.billingCounters, 10) < 0
        ) {
          tempErrors[`billingCounters_${index}`] =
            "Enter a valid number of billing counters";
        }
        if (
          store.inventoryCounters === "" ||
          isNaN(store.inventoryCounters) ||
          parseInt(store.inventoryCounters, 10) < 0
        ) {
          tempErrors[`inventoryCounters_${index}`] =
            "Enter a valid number of inventory counters";
        }
      });
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (validate()) {
      setLoading(true);
      try {
        // Prepare the payload
        const payload = {
          enterpriseName: formData.enterpriseName,
          password: formData.enterprisePassword,
          listOfStoreDetails: formData.storeDetails.map((store) => [
            parseInt(store.billingCounters, 10),
            parseInt(store.inventoryCounters, 10),
          ]),
        };

        const response = await fetch(
          "http://localhost:8080/api/gateway/signup",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          // Handle HTTP errors
          const errorData = await response.json();
          throw new Error(errorData.message || "Something went wrong!");
        }

        const data = await response.json();
        console.log(data);

        // Save the relevant data to local storage
        localStorage.setItem("enterpriseId", data.entId);
        localStorage.setItem(
          "enterpriseDescription",
          data.enterpriseDescription
        );
        localStorage.setItem(
          "listOfStoreDetails",
          JSON.stringify(data.listOfStoreDetails)
        );

        setSuccessMessage(
          `Registration successful! Your Enterprise ID is: ${data.entId}`
        );

        // Reset form
        setFormData({
          enterpriseName: "",
          enterpriseDescription: "",
          numberOfStores: "",
          storeDetails: [],
          enterprisePassword: "",
        });
        setErrors({});

        // Redirect to home page after successful registration
        navigate("/home");
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle input changes for enterprise fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    // If numberOfStores changes, reset storeDetails
    if (name === "numberOfStores") {
      const num = parseInt(value, 10);
      if (!isNaN(num) && num > 0) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
          storeDetails: Array.from({ length: num }, () => ({
            billingCounters: "",
            inventoryCounters: "",
          })),
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
          storeDetails: [],
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle changes in store details
  const handleStoreChange = (index, field, value) => {
    const updatedStoreDetails = [...formData.storeDetails];
    updatedStoreDetails[index][field] = value;
    setFormData((prevData) => ({
      ...prevData,
      storeDetails: updatedStoreDetails,
    }));
  };

  return (
    <>
      <Navbar></Navbar>
      <Container
        maxWidth="md"
        sx={{
          mt: 5,
          backgroundColor: "#f4f6f8",
          padding: 4,
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
            Create Enterprise Account
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
            Fill in the details below to register your enterprise
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
              {/* Enterprise Details */}
              <Typography variant="h6" sx={{ mt: 2 }}>
                Enterprise Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Enterprise Name"
                    variant="outlined"
                    name="enterpriseName"
                    value={formData.enterpriseName}
                    onChange={handleChange}
                    error={!!errors.enterpriseName}
                    helperText={errors.enterpriseName}
                    fullWidth
                    sx={{ backgroundColor: "#fff" }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Enterprise Password"
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    name="enterprisePassword"
                    value={formData.enterprisePassword}
                    onChange={handleChange}
                    error={!!errors.enterprisePassword}
                    helperText={errors.enterprisePassword}
                    fullWidth
                    required
                    sx={{ backgroundColor: "#fff" }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <TextField
                label="Enterprise Description"
                variant="outlined"
                name="enterpriseDescription"
                value={formData.enterpriseDescription}
                onChange={handleChange}
                error={!!errors.enterpriseDescription}
                helperText={errors.enterpriseDescription}
                fullWidth
                sx={{ backgroundColor: "#fff" }}
                required
              />
              <TextField
                label="Number of Stores"
                variant="outlined"
                type="number"
                name="numberOfStores"
                value={formData.numberOfStores}
                onChange={handleChange}
                error={!!errors.numberOfStores}
                helperText={errors.numberOfStores}
                fullWidth
                sx={{ backgroundColor: "#fff" }}
                required
              />

              {/* Store Details */}
              <Typography variant="h6">Store Details</Typography>
              {formData.storeDetails.map((store, index) => (
                <Box key={index} display="flex" gap="20px" sx={{ mb: 2 }}>
                  <TextField
                    label="Billing Counters"
                    variant="outlined"
                    type="number"
                    value={store.billingCounters}
                    onChange={(e) =>
                      handleStoreChange(
                        index,
                        "billingCounters",
                        e.target.value
                      )
                    }
                    error={!!errors[`billingCounters_${index}`]}
                    helperText={errors[`billingCounters_${index}`]}
                    fullWidth
                    sx={{ backgroundColor: "#fff" }}
                    required
                  />
                  <TextField
                    label="Inventory Counters"
                    variant="outlined"
                    type="number"
                    value={store.inventoryCounters}
                    onChange={(e) =>
                      handleStoreChange(
                        index,
                        "inventoryCounters",
                        e.target.value
                      )
                    }
                    error={!!errors[`inventoryCounters_${index}`]}
                    helperText={errors[`inventoryCounters_${index}`]}
                    fullWidth
                    sx={{ backgroundColor: "#fff" }}
                    required
                  />
                </Box>
              ))}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ mt: 3 }}
              >
                {loading ? <CircularProgress size={24} /> : "Register"}
              </Button>
            </Box>
          </form>
        </Box>
      </Container>
    </>
  );
}
