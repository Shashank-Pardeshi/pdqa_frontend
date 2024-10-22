import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [category, setCategory] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const validateForm = () => {
    setError("");

    if (!/^[a-zA-Z\s]+$/.test(productName)) {
      setError("Product name must be alphabetic.");
      return false;
    }

    if (!/^[a-zA-Z0-9\s]+$/.test(productDescription)) {
      setError("Product description must be alphanumeric.");
      return false;
    }

    if (!/^[a-zA-Z\s]+$/.test(category)) {
      setError("Category must be alphabetic.");
      return false;
    }

    const price = parseFloat(sellingPrice);
    if (isNaN(price) || price <= 0) {
      setError("Selling price must be a float greater than 0.");
      return false;
    }

    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      const productData = {
        productName,
        productDescription,
        category,
        sellingPrice: parseFloat(sellingPrice),
      };

      console.log("Product added:", productData);
      setSuccessMessage("Product added successfully!");
      setOpenSnackbar(true);
      resetForm();
    }
  };

  const resetForm = () => {
    setProductName("");
    setProductDescription("");
    setCategory("");
    setSellingPrice("");
    setError("");
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 5,
        p: 4,
        backgroundColor: "#f9f9f9",
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <Typography variant="h4" gutterBottom align="center" color="#1976D2">
        Add Product
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            label="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            fullWidth
            required
            margin="normal"
            variant="outlined"
            sx={{
              backgroundColor: "#fff",
              borderRadius: 1,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#1976D2",
                },
                "&:hover fieldset": {
                  borderColor: "#125a9c",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1976D2",
                },
              },
            }}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Product Description"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            fullWidth
            required
            margin="normal"
            variant="outlined"
            sx={{
              backgroundColor: "#fff",
              borderRadius: 1,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#1976D2",
                },
                "&:hover fieldset": {
                  borderColor: "#125a9c",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1976D2",
                },
              },
            }}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
            required
            margin="normal"
            variant="outlined"
            sx={{
              backgroundColor: "#fff",
              borderRadius: 1,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#1976D2",
                },
                "&:hover fieldset": {
                  borderColor: "#125a9c",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1976D2",
                },
              },
            }}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Selling Price"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            type="number"
            step="0.01"
            fullWidth
            required
            margin="normal"
            variant="outlined"
            sx={{
              backgroundColor: "#fff",
              borderRadius: 1,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#1976D2",
                },
                "&:hover fieldset": {
                  borderColor: "#125a9c",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1976D2",
                },
              },
            }}
          />
        </Box>
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            mt: 2,
            backgroundColor: "#1976D2",
            "&:hover": { backgroundColor: "#125a9c" },
          }}
        >
          Add Product
        </Button>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddProduct;
