import {
  Typography,
  Button,
  TextField,
  Box,
  IconButton,
  MenuItem,
} from "@mui/material";
import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

let productList = [
  {
    id: 1,
    name: "Apple",
    category: "Fruit",
    costPrice: "0.50",
    sellingPrice: "1.00",
    stock: "In Stock",
    quantatiy: "1",
  },
  // Add initial products here...
];

export default function Products() {
  const [productForm, setProductForm] = useState({
    id: "",
    name: "",
    category: "",
    costPrice: "",
    sellingPrice: "",
    stock: "",
    quantatiy: "",
  });
  const [editing, setEditing] = useState(false);
  const [rows, setRows] = useState(productList);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      const updatedRows = rows.map((product) =>
        product.id === productForm.id
          ? { ...productForm, id: product.id }
          : product
      );
      setRows(updatedRows);
      setEditing(false);
    } else {
      const newId = rows.length + 1;
      const newProduct = { ...productForm, id: newId };
      setRows([...rows, newProduct]);
    }
    setProductForm({
      id: "",
      name: "",
      category: "",
      costPrice: "",
      sellingPrice: "",
      stock: "",
      quantatiy: "",
    });
  };

  const handleEdit = (product) => {
    setProductForm(product);
    setEditing(true);
  };

  const handleDelete = (id) => {
    setRows(rows.filter((product) => product.id !== id));
    setProductForm({
      id: "",
      name: "",
      category: "",
      costPrice: "",
      sellingPrice: "",
      stock: "",
      quantatiy: "",
    });
    setEditing(false);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Product", width: 150 },
    { field: "category", headerName: "Category", width: 120 },
    { field: "costPrice", headerName: "Cost Price", width: 120 },
    { field: "sellingPrice", headerName: "Selling Price", width: 120 },
    { field: "quantatiy", headerName: "quantatiy", width: 100 }, // New quantatiy Field
    { field: "stock", headerName: "Stock", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <Box display="flex" gap="10px" alignItems="center">
          <TextField
            label="Product Name"
            variant="outlined"
            size="small"
            name="name"
            value={productForm.name}
            onChange={handleChange}
          />
          <TextField
            label="Category"
            variant="outlined"
            size="small"
            name="category"
            value={productForm.category}
            onChange={handleChange}
          />
          <TextField
            label="Cost Price"
            variant="outlined"
            size="small"
            name="costPrice"
            value={productForm.costPrice}
            onChange={handleChange}
          />
          <TextField
            label="Selling Price"
            variant="outlined"
            size="small"
            name="sellingPrice"
            value={productForm.sellingPrice}
            onChange={handleChange}
          />
          <TextField
            label="quantatiy"
            variant="outlined"
            size="small"
            name="quantatiy"
            value={productForm.quantatiy}
            onChange={handleChange}
          />{" "}
          {/* New quantatiy Field */}
          <TextField
            select
            label="Stock"
            variant="outlined"
            size="small"
            name="stock"
            value={productForm.stock}
            onChange={handleChange}
          >
            <MenuItem value="In Stock">In Stock</MenuItem>
            <MenuItem value="Out of Stock">Out of Stock</MenuItem>
          </TextField>
          <Button type="submit" variant="contained" color="primary">
            {editing ? "Update" : "Add"} Product
          </Button>
        </Box>
      </form>

      <Box height={400}>
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </Box>
    </div>
  );
}
