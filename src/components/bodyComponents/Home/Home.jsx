import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

export default function HomePage() {
  const [enterpriseId, setEnterpriseId] = useState(null);
  const [storeDetails, setStoreDetails] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Retrieve data from local storage
    const storedEnterpriseId = localStorage.getItem("enterpriseId");
    const storedStoreDetails = localStorage.getItem("storeDetails");

    if (storedEnterpriseId) {
      setEnterpriseId(storedEnterpriseId);
    } else {
      setErrorMessage("No enterprise ID found. Please register.");
    }

    if (storedStoreDetails) {
      setStoreDetails(JSON.parse(storedStoreDetails));
    } else {
      setErrorMessage("No store details found.");
    }
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Typography variant="h4" gutterBottom>
        Welcome to Your Home Page
      </Typography>

      {enterpriseId && (
        <Typography variant="h6" gutterBottom>
          Your Enterprise ID: {enterpriseId}
        </Typography>
      )}

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Store Details
      </Typography>
      {storeDetails.length > 0 ? (
        <Table component={Paper}>
          <TableHead>
            <TableRow>
              <TableCell>Store No.</TableCell>
              <TableCell>Billing Counters</TableCell>
              <TableCell>Inventory Counters</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {storeDetails.map((store, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{store.billingCounters}</TableCell>
                <TableCell>{store.inventoryCounters}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography>No store details available.</Typography>
      )}
    </Container>
  );
}
