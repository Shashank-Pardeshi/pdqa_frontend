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
} from "@mui/material";
import * as XLSX from "xlsx";
import axios from "axios";

export default function UpdateInventory() {
  const [storeId, setStoreId] = useState("");
  const [inventoryId, setInventoryId] = useState("");
  const [uploadOption, setUploadOption] = useState(""); // Either 'file' or 'manual'
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    selling_price: "",
    quantity: "",
    description: "",
    gst: "",
  });

  // Handle store selection and inventory ID selection
  const handleStoreChange = (e) => {
    setStoreId(e.target.value);
  };

  const handleInventoryChange = (e) => {
    setInventoryId(e.target.value);
  };

  // Handle file upload and parse the excel file
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
      setData(parsedData);
    };
    reader.readAsBinaryString(uploadedFile);
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
    try {
      await axios.post("/api/inventory/update", { data, storeId, inventoryId }); // Sends data to the backend
      alert("Products have been updated successfully.");
    } catch (err) {
      console.error("Error updating inventory:", err);
      alert("There was an error updating the inventory.");
    }
  };

  // Handle form field change for adding a new product
  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // Add new product to the data
  const handleAddProduct = () => {
    setData([...data, newProduct]);
    setNewProduct({
      name: "",
      category: "",
      selling_price: "",
      quantity: "",
      description: "",
      gst: "",
    });
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
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              style={{ marginBottom: "20px" }}
            />

            {file && (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
                    <TableRow>
                      <TableCell>
                        <strong>Name</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Category</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Selling Price</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Quantity</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Description</strong>
                      </TableCell>
                      <TableCell>
                        <strong>GST</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <TextField
                            value={row.name}
                            onChange={(e) =>
                              handleFieldChange(index, "name", e.target.value)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            value={row.category}
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
                            type="number"
                            value={row.selling_price}
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
                            type="number"
                            value={row.quantity}
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
                            value={row.description}
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
                            type="number"
                            value={row.gst}
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

        {/* Show the manual product addition form if manual option is selected */}
        {uploadOption === "manual" && (
          <div style={{ marginTop: "20px" }}>
            <Typography variant="h6">Add New Product</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Product Name"
                  name="name"
                  value={newProduct.name}
                  onChange={handleNewProductChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Category"
                  name="category"
                  value={newProduct.category}
                  onChange={handleNewProductChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Selling Price"
                  name="selling_price"
                  type="number"
                  value={newProduct.selling_price}
                  onChange={handleNewProductChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={newProduct.quantity}
                  onChange={handleNewProductChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Description"
                  name="description"
                  value={newProduct.description}
                  onChange={handleNewProductChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="GST"
                  name="gst"
                  type="number"
                  value={newProduct.gst}
                  onChange={handleNewProductChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={handleAddProduct}
                  sx={{ mt: 2 }}
                >
                  Add Product
                </Button>
              </Grid>
            </Grid>
          </div>
        )}

        {/* Submit Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ mt: 4 }}
        >
          Update Inventory
        </Button>
      </Paper>
    </Container>
  );
}
