import React, { useState } from "react";
import {
  Button,
  Typography,
  TextField,
  Grid,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import * as XLSX from "xlsx";
// import axios from "axios";

export default function UpdateInventory() {
  const [enterpriseId, setEnterpriseId] = useState("");
  const [storeId, setStoreId] = useState("");
  const [counterId, setCounterId] = useState("");
  const [uploadOption, setUploadOption] = useState("");
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [csvErrors, setCsvErrors] = useState([]);
  const [newProduct, setNewProduct] = useState({
    productName: "",
    costPrice: "",
    sellingPrice: "",
    numberOfUnits: "",
  });
  const [errors, setErrors] = useState({});

  const handleEnterpriseChange = (e) => setEnterpriseId(e.target.value);
  const handleStoreChange = (e) => setStoreId(e.target.value);
  const handleCounterChange = (e) => setCounterId(e.target.value);

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

  const validateCSVData = (csvData) => {
    const newErrors = [];
    const validData = csvData.map((row, index) => {
      const errorsForRow = {};
      if (!row.productName)
        errorsForRow.productName = "Product Name is required.";
      if (!Number.isInteger(row.costPrice))
        errorsForRow.costPrice = "Cost price must be an integer.";
      if (!Number.isInteger(row.sellingPrice))
        errorsForRow.sellingPrice = "Selling price must be an integer.";
      if (!Number.isInteger(row.numberOfUnits))
        errorsForRow.numberOfUnits = "Number of units must be an integer.";
      if (!row.enterpriseId)
        errorsForRow.enterpriseId = "Enterprise ID is required.";
      if (!row.storeId) errorsForRow.storeId = "Store ID is required.";
      if (!row.counterId) errorsForRow.counterId = "Counter ID is required.";

      if (Object.keys(errorsForRow).length > 0) {
        newErrors.push({ row: index + 1, errors: errorsForRow });
      }
      return row;
    });

    return { validData, errors: newErrors };
  };

  const handleManualInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleManualSubmit = async () => {
    const { productName, costPrice, sellingPrice, numberOfUnits } = newProduct;
    const validationErrors = {};

    if (!enterpriseId)
      validationErrors.enterpriseId = "Enterprise ID is required.";
    if (!storeId) validationErrors.storeId = "Store ID is required.";
    if (!counterId) validationErrors.counterId = "Counter ID is required.";
    if (!productName)
      validationErrors.productName = "Product Name is required.";
    if (!costPrice || isNaN(costPrice))
      validationErrors.costPrice = "Cost price must be a number.";
    if (!sellingPrice || isNaN(sellingPrice))
      validationErrors.sellingPrice = "Selling price must be a number.";
    if (!numberOfUnits || isNaN(numberOfUnits))
      validationErrors.numberOfUnits = "Number of units must be a number.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      const payload = {
        productName: productName,
        costPrice: parseInt(costPrice),
        sellingPrice: parseInt(sellingPrice),
        enterpriseId: enterpriseId,
        storeId: storeId,
        counterId: counterId,
        numberOfUnits: parseInt(numberOfUnits),
      };

      // axios
      //   .post("/api/createInventoryRecord", postData)
      //   .then((response) =>
      //     console.log("Inventory record created successfully", response.data)
      //   )
      //   .catch((error) =>
      //     console.error("Error creating inventory record", error)
      //   );

      const response = await fetch(
        "http://localhost:8080/api/gateway/inventory/createInventoryRecord",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
        console.log(payload)
      );

      console.log(response);
      if (response.ok) {
        console.log("success");
      } else {
        console.log("error occured");
      }
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Update Inventory
      </Typography>
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
      {uploadOption === "manual" && (
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          <Grid item xs={6}>
            <TextField
              label="Product Name"
              name="productName"
              value={newProduct.productName}
              onChange={handleManualInputChange}
              fullWidth
              error={!!errors.productName}
              helperText={errors.productName}
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
    </Container>
  );
}
