import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import jsPDF from "jspdf";

export default function Billing_Continue() {
  const [storeId, setStoreId] = useState("");
  const [counterId, setCounterId] = useState("");
  const [billId, setBillId] = useState(""); // New Bill ID state
  const [productName, setProductName] = useState("");
  const [billedUnits, setBilledUnits] = useState(1);
  const [listOfPurchases, setListOfPurchases] = useState([]); // To store both existing and newly added products
  const [newlyAddedProducts, setNewlyAddedProducts] = useState([]); // State for newly added products
  const [existingProducts, setExistingProducts] = useState([]); // State for existing products
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [billDetails, setBillDetails] = useState(null);

  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Function to fetch bill details
  const fetchBillDetails = async () => {
    if (!billId) {
      setSnackbarMessage("Please enter a Bill ID.");
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/api/gateway/billing/getBill?billingId=${billId}`
      );

      const fetchedDetails = response.data;
      console.log(fetchedDetails);
      if (fetchedDetails) {
        setBillDetails(fetchedDetails);
        setExistingProducts(fetchedDetails.listOfProducts || []);
        setListOfPurchases(fetchedDetails.listOfProducts || []);
        setSnackbarMessage("Bill details fetched successfully!");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage("No bill found with the provided Bill ID.");
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.error("Error fetching bill details:", err);
      setSnackbarMessage("Failed to fetch bill details. Please try again.");
      setSnackbarOpen(true);
    }
  };

  const handleAddProduct = () => {
    if (!productName || billedUnits < 1) {
      setErrorMessage("Invalid Product ID or Quantity.");
      return;
    }

    const newProduct = {
      productName,
      billedUnits,
    };

    setNewlyAddedProducts((prevProducts) => [...prevProducts, newProduct]);
    setListOfPurchases((prevProducts) => [...prevProducts, newProduct]);
    setProductName("");
    setBilledUnits(1);
    setErrorMessage("");
  };

  const handleSendToBackend = async () => {
    const enterpriseId = localStorage.getItem("enterpriseId");

    if (!enterpriseId) {
      setSnackbarMessage("Enterprise ID not found in local storage.");
      setSnackbarOpen(true);
      return;
    }

    if (!storeId || !counterId || !billId) {
      setSnackbarMessage("Store ID, Counter ID, and Bill ID are required.");
      setSnackbarOpen(true);
      return;
    }

    if (newlyAddedProducts.length === 0) {
      setSnackbarMessage("No new products added to send to backend.");
      setSnackbarOpen(true);
      return;
    }

    const payload = {
      bill: {
        enterpriseId,
        storeId,
        counterId,
        listOfPurchases: newlyAddedProducts,
      },
      billingId: billId,
      // Send only newly added products
    };

    try {
      const response = await axios.put(
        "http://localhost:8080/api/gateway/billing/updateBill",
        payload
      );

      setSnackbarMessage("Bill created successfully!");
      setSnackbarOpen(true);

      // Save bill details to display
      setBillDetails(response.data);

      // Reset state
      setNewlyAddedProducts([]); // Clear newly added products
      setListOfPurchases([...existingProducts]); // Keep existing products intact
      setStoreId("");
      setCounterId("");
      setBillId("");
    } catch (err) {
      console.error("Error sending data to backend:", err);
      setSnackbarMessage("Error creating the bill.");
      setSnackbarOpen(true);
    }
  };

  const generatePDF = () => {
    if (!billDetails) return;

    const doc = new jsPDF();
    doc.setFontSize(16);

    // Add bill details
    doc.text(`Billing ID: ${billDetails.billingId}`, 10, 20);
    doc.text(`Billing Counter: ${billDetails.billingCounter}`, 10, 30);

    // Add product details
    let y = 50;
    billDetails.listOfProducts.forEach((product, index) => {
      doc.text(`${index + 1}. Product: ${product.productId}`, 10, y);
      doc.text(`   Quantity: ${product.billedQuantity}`, 10, y + 10);
      doc.text(`   Price (per unit): $${product.price}`, 10, y + 20);
      doc.text(
        `   Total Price: $${(product.billedQuantity * product.price).toFixed(
          2
        )}`,
        10,
        y + 30
      );
      y += 40;
    });

    doc.save("bill.pdf");
  };

  const handleGoBack = () => {
    setBillDetails(null);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: "#fafafa",
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          color="primary"
          sx={{ mb: 4 }}
        >
          Billing Counter with Bill ID
        </Typography>

        {!billDetails && (
          <>
            <Box display="flex" gap={2} mb={3}>
              <TextField
                label="Bill ID"
                value={billId}
                onChange={(e) => setBillId(e.target.value)}
                fullWidth
              />
              <Button
                variant="contained"
                color="primary"
                onClick={fetchBillDetails}
              >
                Fetch Bill Details
              </Button>
            </Box>
          </>
        )}

        {billDetails && (
          <>
            <Box display="flex" gap={2} mb={3}>
              <TextField
                label="Store ID"
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
                fullWidth
              />
              <TextField
                label="Counter ID"
                value={counterId}
                onChange={(e) => setCounterId(e.target.value)}
                fullWidth
              />
            </Box>

            <Box display="flex" gap={2} mb={3}>
              <TextField
                label="Product ID"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                fullWidth
              />
              <TextField
                label="Quantity"
                type="number"
                value={billedUnits}
                onChange={(e) => setBilledUnits(parseInt(e.target.value) || 1)}
                fullWidth
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddProduct}
              >
                Add Product
              </Button>
            </Box>

            {errorMessage && (
              <Typography color="error" align="center">
                {errorMessage}
              </Typography>
            )}

            {existingProducts.length > 0 && (
              <TableContainer component={Paper} sx={{ mt: 4 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Product ID</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {existingProducts.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">
                          {product.productId}
                        </TableCell>
                        <TableCell align="center">
                          {product.billedQuantity}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}

        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendToBackend}
            sx={{ mr: 2 }}
          >
            Send to Backend
          </Button>
          <Button variant="contained" color="secondary" onClick={generatePDF}>
            Generate PDF
          </Button>
        </Box>
        {billDetails && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleGoBack}
              sx={{ mt: 2 }}
            >
              Go Back
            </Button>
          </Box>
        )}
      </Paper>

      {/* Snackbar for messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
