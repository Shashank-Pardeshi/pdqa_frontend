import {
  Box,
  Grid,
  AppBar,
  Container,
  Typography,
  Paper,
  IconButton,
  Avatar,
  Tooltip,
} from "@mui/material";
import { Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function NavBarComponent() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout actions here, like clearing user data or tokens
    console.log("User logged out");
    // Redirect to login page
    navigate("/login");
  };

  return (
    <Grid container>
      <Grid item md={12}>
        <Paper elevation={4}>
          <AppBar sx={{ padding: 2 }} position="static">
            <Container maxWidth="xxl">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  component="a"
                  href="/"
                  sx={{
                    mx: 2,
                    display: { xs: "none", md: "flex" },
                    fontWeight: 700,
                    letterSpacing: ".2rem",
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  INVENTORY and BILLING MANAGEMENT
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "right",
                    alignItems: "center",
                  }}
                >
                  <Tooltip title="Logout">
                    <IconButton
                      onClick={handleLogout}
                      size="large"
                      sx={{ mx: 2 }}
                      color="inherit"
                    >
                      <Logout />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Container>
          </AppBar>
        </Paper>
      </Grid>
    </Grid>
  );
}
