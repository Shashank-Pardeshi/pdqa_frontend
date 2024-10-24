import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import axios from "axios";

export default function ViewInventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch inventory data from the backend
  const fetchInventory = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/gateway/inventory/getInventory"
      );
      setInventory(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err); // Log the error for debugging
      setError("Error fetching inventory data");
      setLoading(false);
    }
  };

  // Fetch the inventory when the component loads
  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Store Inventory
      </Typography>

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
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Selling Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>GST</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.length > 0 ? (
                inventory.map((item) => (
                  <TableRow key={item.id}>
                    {" "}
                    {/* Use a unique identifier */}
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{`$${item.selling_price.toFixed(2)}`}</TableCell>{" "}
                    {/* Currency formatting */}
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{`${item.gst}%`}</TableCell>{" "}
                    {/* Format GST as a percentage */}
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
    </Container>
  );
}
