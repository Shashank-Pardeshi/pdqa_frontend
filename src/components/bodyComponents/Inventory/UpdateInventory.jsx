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
  const [storeId, setStoreId] = useState("");
  const [inventoryId, setInventoryId] = useState("");
  const [uploadOption, setUploadOption] = useState(""); // Either 'file' or 'manual'
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [csvErrors, setCsvErrors] = useState([]); // To track errors in CSV data
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    selling_price: "",
    quantity: "",
    description: "",
    gst: "",
  });
  const [sampleCSVOpen, setSampleCSVOpen] = useState(false); // Track dialog state
  const [errors, setErrors] = useState({});

  const validCategories = ["Electronics", "Furniture", "Clothing", "Food"];

  // Handle store selection and inventory ID selection
  const handleStoreChange = (e) => {
    setStoreId(e.target.value);
  };

  const handleInventoryChange = (e) => {
    setInventoryId(e.target.value);
  };

  // Handle file upload and parse the excel file with validation
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
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

  // Validate CSV data based on the same validation rules as manual input
  const validateCSVData = (csvData) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    const alphanumericRegex = /^[a-zA-Z0-9\s]+$/;
    const newErrors = [];
    const validData = csvData.map((row, index) => {
      const errorsForRow = {};

      if (!nameRegex.test(row.name)) {
        errorsForRow.name = "Product name should contain only letters.";
      }

      if (!validCategories.includes(row.category)) {
        errorsForRow.category =
          "Invalid category. Must be one of: " + validCategories.join(", ");
      }

      if (!alphanumericRegex.test(row.description)) {
        errorsForRow.description = "Description should be alphanumeric.";
      }

      if (Object.keys(errorsForRow).length > 0) {
        newErrors.push({ rowIndex: index + 1, ...errorsForRow });
      }

      return row; // Return row to keep the data intact
    });

    return { validData, errors: newErrors };
  };

  // Handle option selection for adding inventory
  const handleUploadOptionChange = (e) => {
    setUploadOption(e.target.value);
  };

  // Handle updating a specific field of a row in the table
  const handleFieldChange = (index, field, value) => {
    const updatedData = [...data];
    updatedData[index][field] = value;
    setData(updatedData);
  };

  // Handle submitting updated data to the backend
  const handleSubmit = async () => {
    if (!storeId || !inventoryId) {
      alert("Please select Store ID and Inventory ID.");
      return;
    }

    if (csvErrors.length > 0) {
      alert("Please fix the CSV errors before submitting.");
      return;
    }

    try {
      await axios.post("/api/inventory/update", { data, storeId, inventoryId }); // Sends data to the backend
      alert("Products have been updated successfully.");
    } catch (err) {
      console.error("Error updating inventory:", err);
      alert("There was an error updating the inventory.");
    }
  };

  // Validation for the new product form fields
  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const alphanumericRegex = /^[a-zA-Z0-9\s]+$/;

    if (!nameRegex.test(newProduct.name)) {
      newErrors.name = "Product name should contain only letters.";
    }

    if (!validCategories.includes(newProduct.category)) {
      newErrors.category = "Please select a valid category.";
    }

    if (!alphanumericRegex.test(newProduct.description)) {
      newErrors.description = "Description should be alphanumeric.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Check if any errors exist
  };

  // Handle form field change for adding a new product
  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // Add new product to the data
  const handleAddProduct = () => {
    if (!storeId || !inventoryId) {
      alert("Please select Store ID and Inventory ID before adding a product.");
      return;
    }

    if (validateForm()) {
      setData([...data, newProduct]);
      setNewProduct({
        name: "",
        category: "",
        selling_price: "",
        quantity: "",
        description: "",
        gst: "",
      });
      setErrors({});
    } else {
      alert("Please correct the errors before adding the product.");
    }
  };

  // Handle opening sample CSV dialog
  const handleSampleCSVOpen = () => {
    setSampleCSVOpen(true);
  };

  // Handle closing sample CSV dialog
  const handleSampleCSVClose = () => {
    setSampleCSVOpen(false);
  };

  return (
    <Container maxWidth="md">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 4,
          borderRadius: 3,
          backgroundColor: "#f9f9f9",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          color="primary"
          sx={{ mb: 4 }}
        >
          Update Inventory
        </Typography>

        {/* Store ID and Inventory ID selection */}
        <Box display="flex" gap={2} mb={3}>
          <FormControl fullWidth>
            <InputLabel>Store ID</InputLabel>
            <Select value={storeId} onChange={handleStoreChange}>
              <MenuItem value="store1">Store 1</MenuItem>
              <MenuItem value="store2">Store 2</MenuItem>
              <MenuItem value="store3">Store 3</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Inventory ID</InputLabel>
            <Select value={inventoryId} onChange={handleInventoryChange}>
              <MenuItem value="inventory1">Inventory 1</MenuItem>
              <MenuItem value="inventory2">Inventory 2</MenuItem>
              <MenuItem value="inventory3">Inventory 3</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Option to upload XLSX file or add individual products */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Select Method</InputLabel>
          <Select value={uploadOption} onChange={handleUploadOptionChange}>
            <MenuItem value="file">Upload XLSX File</MenuItem>
            <MenuItem value="manual">Add Product Manually</MenuItem>
          </Select>
        </FormControl>

        {/* Show the XLSX upload section if file option is selected */}
        {uploadOption === "file" && (
          <>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleSampleCSVOpen}
            >
              View Sample CSV
            </Button>

            {/* Sample CSV Dialog */}
            <Dialog open={sampleCSVOpen} onClose={handleSampleCSVClose}>
              <DialogTitle>Sample CSV Format</DialogTitle>
              <DialogContent>
                <pre>
                  {`Name, Category, Selling Price, Quantity, Description, GST
Example Product 1, Electronics, 1000, 10, "A description of product 1", 18`}
                </pre>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleSampleCSVClose} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>

            <Button
              variant="contained"
              component="label"
              color="primary"
              sx={{ mt: 2, mb: 2 }}
            >
              Upload File
              <input
                type="file"
                hidden
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
              />
            </Button>

            {/* Display CSV Errors if any */}
            {csvErrors.length > 0 && (
              <Paper
                elevation={2}
                sx={{ p: 2, mt: 2, backgroundColor: "#ffe6e6" }}
              >
                <Typography variant="h6" color="error" gutterBottom>
                  CSV Errors:
                </Typography>
                <ul>
                  {csvErrors.map((error, idx) => (
                    <li key={idx}>
                      Row {error.rowIndex}: {Object.values(error).join(", ")}
                    </li>
                  ))}
                </ul>
              </Paper>
            )}

            {/* Display the uploaded data */}
            {data.length > 0 && (
              <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Selling Price</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>GST</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <TextField
                            value={row.name || ""}
                            onChange={(e) =>
                              handleFieldChange(index, "name", e.target.value)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            value={row.category || ""}
                            onChange={(e) =>
                              handleFieldChange(
                                index,
                                "category",
                                e.target.value
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            value={row.selling_price || ""}
                            onChange={(e) =>
                              handleFieldChange(
                                index,
                                "selling_price",
                                e.target.value
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            value={row.quantity || ""}
                            onChange={(e) =>
                              handleFieldChange(
                                index,
                                "quantity",
                                e.target.value
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            value={row.description || ""}
                            onChange={(e) =>
                              handleFieldChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            value={row.gst || ""}
                            onChange={(e) =>
                              handleFieldChange(index, "gst", e.target.value)
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}

        {/* Show form to manually add product if manual option is selected */}
        {uploadOption === "manual" && (
          <Box component={Paper} p={2} mb={3}>
            <Typography variant="h6" gutterBottom>
              Add New Product
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Product Name"
                  name="name"
                  fullWidth
                  value={newProduct.name}
                  onChange={handleNewProductChange}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={newProduct.category}
                    onChange={handleNewProductChange}
                    error={!!errors.category}
                  >
                    {validCategories.map((category, idx) => (
                      <MenuItem key={idx} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Selling Price"
                  name="selling_price"
                  fullWidth
                  value={newProduct.selling_price}
                  onChange={handleNewProductChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Quantity"
                  name="quantity"
                  fullWidth
                  value={newProduct.quantity}
                  onChange={handleNewProductChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  fullWidth
                  value={newProduct.description}
                  onChange={handleNewProductChange}
                  error={!!errors.description}
                  helperText={errors.description}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="GST (%)"
                  name="gst"
                  fullWidth
                  value={newProduct.gst}
                  onChange={handleNewProductChange}
                />
              </Grid>
            </Grid>
            <Box display="flex" justifyContent="center" mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddProduct}
              >
                Add Product
              </Button>
            </Box>
          </Box>
        )}

        {/* Submit Button */}
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
