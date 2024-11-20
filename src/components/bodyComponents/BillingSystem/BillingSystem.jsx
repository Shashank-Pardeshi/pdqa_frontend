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
} from "@mui/material";
import axios from "axios";
import jsPDF from "jspdf";

export default function BillingSystem() {
  const [storeId, setStoreId] = useState("");
  const [counterId, setCounterId] = useState("");
  const [productName, setProductName] = useState("");
  const [billedUnits, setBilledUnits] = useState(1);
  const [listOfPurchases, setListOfPurchases] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [billDetails, setBillDetails] = useState(null);

  const handleAddProduct = () => {
    if (!productName || billedUnits < 1) {
      setErrorMessage("Invalid Product ID or Quantity.");
      return;
    }

    const newProduct = {
      productName,
      billedUnits,
    };

    setListOfPurchases((prevProducts) => [...prevProducts, newProduct]);
    setProductName("");
    setBilledUnits(1);
    setErrorMessage("");
  };

  const handleSendToBackend = async () => {
    const enterpriseId = localStorage.getItem("enterpriseId");

    if (!enterpriseId) {
      alert("Enterprise ID not found in local storage.");
      return;
    }

    if (!storeId || !counterId) {
      alert("Store ID and Counter ID are required.");
      return;
    }

    if (listOfPurchases.length === 0) {
      alert("No listOfPurchases added to send to backend.");
      return;
    }

    const payload = {
      enterpriseId,
      storeId,
      counterId,
      listOfPurchases,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/gateway/billing/createBill",
        payload
      );

      alert("Bill created successfully!");
      console.log("Response:", response);

      // Save bill details to display
      setBillDetails(response.data);

      // Reset state
      setListOfPurchases([]);
      setStoreId("");
      setCounterId("");
    } catch (err) {
      console.error("Error sending listOfPurchases to backend:", err);
      alert("Error creating the bill.");
    }
  };

  const generatePDF = () => {
    if (!billDetails) return;

    const doc = new jsPDF();
    doc.setFontSize(16);

    // Add bill details
    doc.text(`Billing ID: ${billDetails.billingId}`, 10, 20);

    // Add product details
    let y = 40;
    billDetails.listOfProducts.forEach((product, index) => {
      doc.text(`${index + 1}. Product: ${product.productId}`, 10, y);
      doc.text(`   Quantity: ${product.billedQuantity}`, 10, y + 10);
      y += 20;
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
          Billing Counter
        </Typography>

        {!billDetails && (
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

            {listOfPurchases.length > 0 && (
              <>
                <TableContainer component={Paper} sx={{ mt: 4 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Product ID</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {listOfPurchases.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell align="center">
                            {product.productName}
                          </TableCell>
                          <TableCell align="center">
                            {product.billedUnits}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box mt={4} textAlign="center">
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSendToBackend}
                  >
                    Send to Backend
                  </Button>
                </Box>
              </>
            )}
          </>
        )}

        {/* Display Bill Details */}
        {billDetails && (
          <Box mt={4}>
            <Typography
              variant="h5"
              align="center"
              color="primary"
              gutterBottom
            >
              Bill Summary
            </Typography>
            <Typography align="center">Billing ID: {billDetails.id}</Typography>
            <Typography align="center">
              Billing ID: {billDetails.sellingDate}
            </Typography>

            <TableContainer component={Paper} sx={{ mt: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Product ID</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="center">Billing Counter</TableCell>
                    <TableCell align="center">Price (per unit)</TableCell>
                    <TableCell align="center">Total Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {billDetails.listOfProducts.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">{product.productId}</TableCell>
                      <TableCell align="center">
                        {product.billedQuantity}
                      </TableCell>
                      <TableCell align="center">{product.counterId}</TableCell>
                      <TableCell align="center">
                        ${product.billingPrice}
                      </TableCell>
                      <TableCell align="center">
                        $
                        {(
                          product.billedQuantity * product.billingPrice
                        ).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box
              mt={4}
              textAlign="center"
              display="flex"
              justifyContent="center"
              gap={2}
            >
              <Button variant="contained" color="primary" onClick={generatePDF}>
                Generate PDF
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleGoBack}
              >
                Go Back
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
