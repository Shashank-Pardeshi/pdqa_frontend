import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import axios from "axios";

export default function AddStore() {
  const [storeForm, setStoreForm] = useState({
    billingCounter: "",
    inventoryCounter: "",
  });
  const [storeList, setStoreList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStoreForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddStore = async () => {
    const billingCount = parseInt(storeForm.billingCounter);
    const inventoryCount = parseInt(storeForm.inventoryCounter);

    // Validation: Check if counters are greater than 0
    if (billingCount <= 0 || inventoryCount <= 0) {
      alert(
        "Both billing counters and inventory counters must be greater than 0."
      );
      return;
    }

    const newStore = {
      billingCounter: billingCount,
      inventoryCounter: inventoryCount,
    };

    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      // Make POST request to the API to add a new store
      const response = await axios.post("/api/store/addstore", newStore);

      // On success, update the store list with the new store
      setStoreList([...storeList, newStore]);
      setSuccessMessage("Store added successfully!");

      // Clear the form
      setStoreForm({
        billingCounter: "",
        inventoryCounter: "",
      });
    } catch (err) {
      console.error("Error adding store:", err);
      setError("Failed to add store. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        mt: 5,
        p: 4,
        backgroundColor: "#f9f9f9",
        borderRadius: 3,
        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        marginLeft: "85px",
        width: "800px",
      }}
    >
      <Typography variant="h4" gutterBottom align="center" color="primary">
        Add New Store
      </Typography>

      <Box
        component={Paper}
        elevation={2}
        sx={{
          p: 3,
          mb: 3,
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{ textAlign: "center", fontWeight: "500", color: "#1976D2" }}
        >
          Store Information
        </Typography>

        <Box display="flex" flexDirection="column" gap="20px" sx={{ mb: 3 }}>
          <TextField
            label="No. of Billing Counters"
            variant="outlined"
            type="number"
            name="billingCounter"
            value={storeForm.billingCounter}
            onChange={handleChange}
            fullWidth
            sx={{ backgroundColor: "#f9f9f9", borderRadius: 2 }}
          />
          <TextField
            label="No. of Inventory Counters"
            variant="outlined"
            type="number"
            name="inventoryCounter"
            value={storeForm.inventoryCounter}
            onChange={handleChange}
            fullWidth
            sx={{ backgroundColor: "#f9f9f9", borderRadius: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddStore}
            disabled={loading}
            sx={{
              padding: "10px",
              backgroundColor: "#1976D2",
              "&:hover": { backgroundColor: "#125a9c" },
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Add Store"
            )}
          </Button>
        </Box>

        {/* Success Message */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
      </Box>

      <Typography variant="h5" gutterBottom align="center">
        Current Stores
      </Typography>

      <Box sx={{ mt: 4 }}>
        {storeList.length > 0 ? (
          storeList.map((store, index) => (
            <Box
              key={index}
              sx={{
                mb: 3,
                p: 3,
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                backgroundColor: "#fff",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                <strong>Billing Counters:</strong> {store.billingCounter}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                <strong>Inventory Counters:</strong> {store.inventoryCounter}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography>No stores added yet</Typography>
        )}
      </Box>
    </Box>
  );
}
