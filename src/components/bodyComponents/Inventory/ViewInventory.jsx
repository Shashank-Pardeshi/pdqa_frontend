import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Container,
  CircularProgress,
  Alert,
  TextField,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export default function ViewInventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [storeId, setStoreId] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newQuantity, setNewQuantity] = useState("");
  const enterpriseId = localStorage.getItem("enterpriseId");

  const fetchInventory = async () => {
    if (!storeId) {
      setError("Store ID is required");
      return;
    }

    if (!enterpriseId) {
      setError("Enterprise ID not found. Please log in again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8080/api/gateway/inventory/getAllInventory?enterpriseId=${enterpriseId}&storeId=${storeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch inventory data");
      }

      const data = await response.json();
      setInventory(data);
    } catch (err) {
      console.error(err);
      setError("Error fetching inventory data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (product) => {
    setSelectedProduct(product);
    setNewQuantity(product.quantity); // Pre-fill with current quantity
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
    setNewQuantity("");
  };

  const handleUpdateQuantity = async () => {
    if (isNaN(newQuantity) || newQuantity === "") {
      alert("Please enter a valid quantity.");
      return;
    }

    console.log(newQuantity);

    try {
      const response = await fetch(
        `http://localhost:8080/api/gateway/inventory/updateInventory?inventoryId=${selectedProduct.inventoryId}&amount=${newQuantity}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          // body: JSON.stringify({
          //   inventoryId: selectedProduct.inventoryId,
          //   productName: selectedProduct.productId, // Assuming productId is the product name
          //   quantity: parseInt(newQuantity, 10),
          // }),
        }
      );

      console.log(selectedProduct.inventoryId);
      console.log(selectedProduct.productId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update quantity");
      }

      handleCloseDialog();
      fetchInventory(); // Reload inventory data
    } catch (err) {
      console.error(err);
      alert("Error updating quantity. Please try again.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Store Inventory
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={8}>
          <TextField
            label="Store ID"
            value={storeId}
            onChange={(e) => {
              setStoreId(e.target.value);
              setError(""); // Clear error when input changes
            }}
            fullWidth
            error={!!error}
            helperText={error}
          />
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={fetchInventory}
            disabled={loading}
          >
            {loading ? "Loading..." : "Fetch Inventory"}
          </Button>
        </Grid>
      </Grid>

      {loading ? (
        <div style={{ textAlign: "center" }}>
          <CircularProgress />
          <Typography variant="body1">Loading inventory data...</Typography>
        </div>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Cost Price</TableCell>
                <TableCell>Selling Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.length > 0 ? (
                inventory.map((item) => (
                  <TableRow key={item.inventoryId}>
                    <TableCell>{item.productId}</TableCell>
                    <TableCell>${item.costprice.toFixed(2)}</TableCell>
                    <TableCell>${item.sellprice.toFixed(2)}</TableCell>
                    <TableCell>{item.quantity ?? "Not available"}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleOpenDialog(item)}
                      >
                        Update Quantity
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No inventory available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog for updating quantity */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update Quantity</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <>
              <Typography variant="body1">
                <strong>Product Name:</strong> {selectedProduct.productId}
              </Typography>
              <Typography variant="body1">
                <strong>Cost Price:</strong> $
                {selectedProduct.costprice.toFixed(2)}
              </Typography>
              <Typography variant="body1">
                <strong>Selling Price:</strong> $
                {selectedProduct.sellprice.toFixed(2)}
              </Typography>
              <TextField
                label="New Quantity"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                fullWidth
                margin="normal"
                type="number"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateQuantity}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
