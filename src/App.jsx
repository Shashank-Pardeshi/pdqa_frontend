import Inter from "../public/static/fonts/Inter.ttf";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import RootComponent from "./components/RootComponent";
import RootPage from "./components/RootPage";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Home from "./components/bodyComponents/home/Home";

import Register from "./components/bodyComponents/register/Register";
import Login from "./components/bodyComponents/login/Login";
import BillingSystem from "./components/bodyComponents/BillingSystem/BillingSystem";
import AddStore from "./components/bodyComponents/AddStore/AddStore";
import UpdateInventory from "./components/bodyComponents/Inventory/UpdateInventory";
import ViewInventory from "./components/bodyComponents/Inventory/ViewInventory";

function App() {
  const theme = createTheme({
    spacing: 4,
    palette: {
      mode: "light",
      // Uncomment and adjust the primary colors as needed
      // primary: {
      //   main: "#573BFE",
      // },
      // text: {
      //   primary: "#202635",
      //   secondary: "#A0AEC0",
      // },
      // secondary: {
      //   main: "#01C0F6",
      // },
      // error: {
      //   main: "#E03137",
      // },
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
            src: local('Raleway'), local('Raleway-Regular'), url(${Inter}) format('woff2');
            unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
          }
        `,
      },
    },
  });

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<RootComponent />}>
          <Route index element={<RootPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/updateinventory" element={<UpdateInventory />} />
          <Route path="/viewinventory" element={<ViewInventory />} />
          <Route path="/AddStore" element={<AddStore />} />
          <Route path="/billing" element={<BillingSystem />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </>
    )
  );

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
      <CssBaseline />
    </ThemeProvider>
  );
}

export default App;
