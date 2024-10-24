import React, { useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Grid,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import * as XLSX from "xlsx";
import axios from "axios";

export default function UpdateInventory() {
  const [enterpriseId, setEnterpriseId] = useState("");
  const [storeId, setStoreId] = useState("");
  const [counterId, setCounterId] = useState("");
  const [uploadOption, setUploadOption] = useState(""); // Either 'file' or 'manual'
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [csvErrors, setCsvErrors] = useState([]); // To track errors in CSV data
  const [newProduct, setNewProduct] = useState({
    productId: "",
    costPrice: "",
    sellingPrice: "",
    numberOfUnits: "",
  });
  const [sampleCSVOpen, setSampleCSVOpen] = useState(false); // Track dialog state
  const [errors, setErrors] = useState({});

  // Handle store, enterprise, and counter selection
  const handleEnterpriseChange = (e) => {
    setEnterpriseId(e.target.value);
  };

  const handleStoreChange = (e) => {
    setStoreId(e.target.value);
  };

  const handleCounterChange = (e) => {
    setCounterId(e.target.value);
  };

  // Handle file upload and parse the CSV file with validation
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];

    if (!uploadedFile.name.endsWith(".csv")) {
      alert("Please upload a valid CSV file.");
      setFile(null);
      return;
    }

    setFile(uploadedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);

      const { validData, errors } = validateCSVData(parsedData);
      setData(validData);
      setCsvErrors(errors);
    };
    reader.readAsBinaryString(uploadedFile);
  };

  // Validate CSV data
  const validateCSVData = (csvData) => {
    const newErrors = [];
    const validData = csvData.map((row, index) => {
      const errorsForRow = {};

      if (!row.productId) {
        errorsForRow.productId = "Product ID is required.";
      }
      if (!Number.isInteger(row.costPrice)) {
        errorsForRow.costPrice = "Cost price must be an integer.";
      }
      if (!Number.isInteger(row.sellingPrice)) {
        errorsForRow.sellingPrice = "Selling price must be an integer.";
      }
      if (!Number.isInteger(row.numberOfUnits)) {
        errorsForRow.numberOfUnits = "Number of units must be an integer.";
      }

      if (!row.enterpriseId) {
        errorsForRow.enterpriseId = "Enterprise ID is required.";
      }
      if (!row.storeId) {
        errorsForRow.storeId = "Store ID is required.";
      }
      if (!row.counterId) {
        errorsForRow.counterId = "Counter ID is required.";
      }

      if (Object.keys(errorsForRow).length > 0) {
        newErrors.push({ row: index + 1, errors: errorsForRow });
      }

      return row;
    });

    return { validData, errors: newErrors };
  };

  // Handle manual product input
  const handleManualInputChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleManualSubmit = () => {
    const { productId, costPrice, sellingPrice, numberOfUnits } = newProduct;
    const validationErrors = {};

    // Validate the enterprise, store, and counter IDs
    if (!enterpriseId) {
      validationErrors.enterpriseId = "Enterprise ID is required.";
    }
    if (!storeId) {
      validationErrors.storeId = "Store ID is required.";
    }
    if (!counterId) {
      validationErrors.counterId = "Counter ID is required.";
    }

    // Validate product fields
    if (!productId) {
      validationErrors.productId = "Product ID is required.";
    }
    if (!costPrice || isNaN(costPrice)) {
      validationErrors.costPrice = "Cost price must be a number.";
    }
    if (!sellingPrice || isNaN(sellingPrice)) {
      validationErrors.sellingPrice = "Selling price must be a number.";
    }
    if (!numberOfUnits || isNaN(numberOfUnits)) {
      validationErrors.numberOfUnits = "Number of units must be a number.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      // Post the data to the backend
      const postData = {
        productId,
        costPrice: parseInt(costPrice),
        sellingPrice: parseInt(sellingPrice),
        enterpriseId,
        storeId,
        counterId,
        numberOfUnits: parseInt(numberOfUnits),
      };

      axios
        .post("/api/inventory/update", postData)
        .then((response) => {
          console.log("Inventory updated successfully", response.data);
        })
        .catch((error) => {
          console.error("Error updating inventory", error);
        });
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Update Inventory
      </Typography>

      {/* Store, Enterprise, and Counter Selection */}
      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={4}>
          <TextField
            label="Enterprise ID"
            value={enterpriseId}
            onChange={handleEnterpriseChange}
            fullWidth
            error={!!errors.enterpriseId}
            helperText={errors.enterpriseId}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Store ID"
            value={storeId}
            onChange={handleStoreChange}
            fullWidth
            error={!!errors.storeId}
            helperText={errors.storeId}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Counter ID"
            value={counterId}
            onChange={handleCounterChange}
            fullWidth
            error={!!errors.counterId}
            helperText={errors.counterId}
          />
        </Grid>
      </Grid>

      {/* Upload option selector */}
      <FormControl fullWidth>
        <InputLabel id="upload-option-label">Upload Option</InputLabel>
        <Select
          labelId="upload-option-label"
          value={uploadOption}
          onChange={(e) => setUploadOption(e.target.value)}
        >
          <MenuItem value="file">Upload CSV File</MenuItem>
          <MenuItem value="manual">Manual Input</MenuItem>
        </Select>
      </FormControl>

      {/* CSV File Upload */}
      {uploadOption === "file" && (
        <Box sx={{ marginTop: 2 }}>
          <Button variant="contained" component="label">
            Upload CSV File
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={handleFileUpload}
            />
          </Button>

          {/* Display CSV errors if any */}
          {csvErrors.length > 0 && (
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="h6">CSV Errors:</Typography>
              {csvErrors.map((error, index) => (
                <Typography key={index}>
                  Row {error.row}: {JSON.stringify(error.errors)}
                </Typography>
              ))}
            </Box>
          )}
          <Button
            variant="outlined"
            onClick={() => setSampleCSVOpen(true)}
            sx={{ marginTop: 2 }}
          >
            View Sample CSV Format
          </Button>
        </Box>
      )}

      {/* Manual Product Input */}
      {uploadOption === "manual" && (
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          <Grid item xs={6}>
            <TextField
              label="Product ID"
              name="productId"
              value={newProduct.productId}
              onChange={handleManualInputChange}
              fullWidth
              error={!!errors.productId}
              helperText={errors.productId}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Cost Price"
              name="costPrice"
              value={newProduct.costPrice}
              onChange={handleManualInputChange}
              fullWidth
              error={!!errors.costPrice}
              helperText={errors.costPrice}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Selling Price"
              name="sellingPrice"
              value={newProduct.sellingPrice}
              onChange={handleManualInputChange}
              fullWidth
              error={!!errors.sellingPrice}
              helperText={errors.sellingPrice}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Number of Units"
              name="numberOfUnits"
              value={newProduct.numberOfUnits}
              onChange={handleManualInputChange}
              fullWidth
              error={!!errors.numberOfUnits}
              helperText={errors.numberOfUnits}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleManualSubmit}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      )}

      {/* Dialog for Sample CSV */}
      <Dialog
        open={sampleCSVOpen}
        onClose={() => setSampleCSVOpen(false)}
        maxWidth="md"
      >
        <DialogTitle>Sample CSV Format</DialogTitle>
        <DialogContent>
          <Typography>
            Please use the following format for your CSV file:
          </Typography>
          <Typography>
            <strong>
              productId, costPrice, sellingPrice, enterpriseId, storeId,
              counterId, numberOfUnits
            </strong>
          </Typography>
          <Typography>Example: 123, 20, 25, 1, 1, 1, 100</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSampleCSVOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
