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
import { jsPDF } from "jspdf";

export default function BillingSystem() {
  const [storeId, setStoreId] = useState("");
  const [billingId, setBillingId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [products, setProducts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [quantityError, setQuantityError] = useState(""); // State for quantity error

  // Fetch product details by product ID and validate against store and enterprise ID
  const handleAddProduct = async () => {
    const enterpriseId = localStorage.getItem("enterpriseId"); // Retrieve enterprise ID from local storage
    if (!enterpriseId) {
      alert("Enterprise ID not found in local storage.");
      return;
    }

    try {
      // Check if the product exists in the specified store and enterprise
      const response = await axios.get(
        `http://localhost:8080/api/gateway/inventory/getInventory?productId=${productId}&enterpriseId=${enterpriseId}&storeId=${storeId}`
      );

      const product = response.data;

      // If product is not found, handle error
      if (!product) {
        setErrorMessage("Product not found in this store."); // Set error message
        return;
      }

      // Check if the entered quantity is greater than available stock
      if (quantity > product.quantity) {
        setQuantityError(
          `Quantity exceeds available stock (${product.quantity}).`
        );
        return;
      } else {
        setQuantityError(""); // Clear quantity error if valid
      }

      // Calculate product total price based solely on selling price
      const productTotalPrice = product.sellprice * quantity;

      // Add the product to the products array
      const newProduct = {
        ...product,
        quantity,
        total_price: productTotalPrice,
      };

      setProducts((prevProducts) => [...prevProducts, newProduct]);
      setTotalAmount((prevTotal) => prevTotal + productTotalPrice);
      setProductId(""); // Clear the product ID field
      setQuantity(1); // Reset quantity
      setErrorMessage(""); // Clear error message
    } catch (err) {
      console.error("Error fetching product details:", err);
      setErrorMessage("Error fetching product details."); // Set error message
    }
  };

  // Handle finishing and generating the bill
  const handleFinishBill = () => {
    const doc = new jsPDF();

    doc.text(`Store ID: ${storeId}`, 10, 10);
    doc.text(`Billing ID: ${billingId}`, 10, 20);

    let yPosition = 30;
    doc.text("Product List:", 10, yPosition);
    yPosition += 10;

    products.forEach((product, index) => {
      doc.text(
        `${index + 1}. ${product.name} - Quantity: ${
          product.quantity
        }, Total Price: ₹${product.total_price.toFixed(2)}`,
        10,
        yPosition
      );
      yPosition += 10;
    });

    doc.text(`Total Amount: ₹${totalAmount.toFixed(2)}`, 10, yPosition + 10);
    doc.save("bill.pdf"); // Save the bill as PDF
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

        {/* Store ID and Billing ID Inputs */}
        <Box
          display="flex"
          gap={2}
          mb={3}
          sx={{
            backgroundColor: "#f0f0f0",
            padding: 2,
            borderRadius: 2,
            boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
          }}
        >
          <TextField
            label="Store ID"
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
            fullWidth
            sx={{ backgroundColor: "#fff", borderRadius: 2 }}
          />
          <TextField
            label="Billing ID"
            value={billingId}
            onChange={(e) => setBillingId(e.target.value)}
            fullWidth
            sx={{ backgroundColor: "#fff", borderRadius: 2 }}
          />
        </Box>

        {/* Add Product Section */}
        <Box
          display="flex"
          gap={2}
          mb={3}
          sx={{
            backgroundColor: "#f0f0f0",
            padding: 2,
            borderRadius: 2,
            boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
          }}
        >
          <TextField
            label="Product ID"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            fullWidth
            sx={{ backgroundColor: "#fff", borderRadius: 2 }}
          />
          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            fullWidth
            sx={{ backgroundColor: "#fff", borderRadius: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddProduct}
            sx={{
              padding: "10px 20px",
              backgroundColor: "#1976D2",
              "&:hover": { backgroundColor: "#125a9c" },
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            Add Product
          </Button>
        </Box>

        {/* Error Messages */}
        {errorMessage && (
          <Typography color="error" align="center">
            {errorMessage}
          </Typography>
        )}
        {quantityError && (
          <Typography color="error" align="center">
            {quantityError}
          </Typography>
        )}

        {/* Product List Table */}
        {products.length > 0 && (
          <TableContainer
            component={Paper}
            sx={{
              mt: 4,
              borderRadius: 2,
              backgroundColor: "#fff",
              boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Category</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Selling Price</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Quantity</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Total Price</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{product.name}</TableCell>
                    <TableCell align="center">{product.category}</TableCell>
                    <TableCell align="center">{product.sellprice}</TableCell>
                    <TableCell align="center">{product.quantity}</TableCell>
                    <TableCell align="center">
                      {product.total_price.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Total Amount and Finish Button */}
        {products.length > 0 && (
          <Box mt={4} textAlign="center">
            <Typography variant="h6" gutterBottom>
              Total Amount: ₹{totalAmount.toFixed(2)}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleFinishBill}
              sx={{
                mt: 2,
                padding: "10px 20px",
                backgroundColor: "#E53935",
                "&:hover": { backgroundColor: "#B71C1C" },
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              Finish & Generate Bill
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
