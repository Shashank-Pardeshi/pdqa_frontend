import React from "react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Inter from "../public/static/fonts/Inter.ttf";
import RootComponent from "./components/RootComponent";
import Home from "./components/bodyComponents/home/Home";
import Register from "./components/bodyComponents/register/Register";
import Login from "./components/bodyComponents/login/Login";
import BillingSystem from "./components/bodyComponents/BillingSystem/BillingSystem";
import AddStore from "./components/bodyComponents/AddStore/AddStore";
import UpdateInventory from "./components/bodyComponents/Inventory/UpdateInventory";
import ViewInventory from "./components/bodyComponents/Inventory/ViewInventory";
import AddProduct from "./components/bodyComponents/AddProduct/AddProduct";

function App() {
  const theme = createTheme({
    spacing: 4,
    palette: {
      mode: "light",
    },
    typography: {
      fontFamily: "Inter",
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          @font-face {
            font-family: 'Inter';
            font-style: normal;
            font-display: swap;
            font-weight: 400;
            src: local('Inter'), local('Inter-Regular'), url(${Inter}) format('woff2');
            unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
          }
        `,
      },
    },
  });

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Direct access to all routes without authentication */}
        <Route element={<RootComponent />}>
          <Route path="/home" element={<Home />} />
          <Route path="/updateinventory" element={<UpdateInventory />} />
          <Route path="/viewinventory" element={<ViewInventory />} />
          <Route path="/addstore" element={<AddStore />} />
          <Route path="/billing" element={<BillingSystem />} />
          <Route path="/addproduct" element={<AddProduct />} />
        </Route>
      </>
    )
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
