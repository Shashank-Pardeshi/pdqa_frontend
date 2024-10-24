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
    const storedEnterpriseId = localStorage.getItem("enterpriseId");
    const storedStoreDetails = localStorage.getItem("listOfStoreDetails");

    if (storedEnterpriseId) {
      setEnterpriseId(storedEnterpriseId);
    } else {
      setErrorMessage("No enterprise ID found. Please register.");
    }

    if (storedStoreDetails) {
      try {
        const parsedStoreDetails = JSON.parse(storedStoreDetails);
        if (Array.isArray(parsedStoreDetails)) {
          setStoreDetails(parsedStoreDetails);
        } else {
          setErrorMessage("Store details are not in the expected format.");
        }
      } catch (error) {
        setErrorMessage("Error parsing store details from local storage.");
      }
    } else {
      setErrorMessage("No store details found. Please register.");
    }
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to the Enterprise Dashboard
      </Typography>

      {/* Display error message if exists */}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {/* Display enterprise ID */}
      {enterpriseId && (
        <Typography variant="h6" gutterBottom>
          Your Enterprise ID: {enterpriseId}
        </Typography>
      )}

      {/* Display store details in a table */}
      {storeDetails.length > 0 && (
        <Paper sx={{ overflow: "hidden", mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Enterprise ID</TableCell>
                <TableCell>Store ID</TableCell>
                <TableCell>Billing Counter ID</TableCell>
                <TableCell>Inventory Counter ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {storeDetails.map((store, storeIndex) => {
                const billingCounters = store.listOfBillingCounters;
                const inventoryCounters = store.listOfInventoryCounters;

                return billingCounters.map((billingCounter, billingIndex) => (
                  <TableRow key={`${storeIndex}-${billingIndex}`}>
                    {/* Displaying enterprise ID from billing counter */}
                    <TableCell>{billingCounter.entId}</TableCell>
                    <TableCell>{store.storeId}</TableCell>
                    <TableCell>{billingCounter.billingCounterId}</TableCell>
                    {/* Display inventory counter from the list; assuming you want the first one or modify as needed */}
                    <TableCell>
                      {inventoryCounters.length > 0
                        ? inventoryCounters[0].inventoryCounterId
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                ));
              })}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
}
