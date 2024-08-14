import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import DataDisplay from "./DataDisplay"; // Import the updated DataDisplay component
import "./Dashboard.css"; // Import custom CSS

// Styled components for design
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.primary.main,
  "&:hover": {
    textDecoration: "underline",
  },
}));

const MaintenanceHistory = ({ maintenanceData }) => {
  const [showAll, setShowAll] = useState(false);

  const handleToggle = () => {
    setShowAll(!showAll);
  };

  return (
    <Card>
      <CardHeader title="Maintenance History" />
      <Divider />
      <CardContent>
        {maintenanceData.length === 0 ? (
          <Typography variant="body1">
            No maintenance records available.
          </Typography>
        ) : (
          <>
            <List>
              {maintenanceData
                .slice(0, showAll ? undefined : 1)
                .map((record, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={`Date: ${record.maintenanceData}`}
                      secondary={
                        <>
                          <Typography variant="body2">
                            <strong>Price:</strong> ${record.maintenancePrice}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Description:</strong>{" "}
                            {record.maintenanceDescription}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Expected Completion Date:</strong>{" "}
                            {record.maintenanceExpectData}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
            </List>
            {maintenanceData.length > 1 && (
              <Button
                onClick={handleToggle}
                startIcon={showAll ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              >
                {showAll ? "Show Less" : "Show All"}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  // Retrieve data from localStorage
  const currentUserId = localStorage.getItem("currentUserId");
  const userEmail = localStorage.getItem("email");

  const restaurantData =
    JSON.parse(localStorage.getItem("restaurantData")) || {};
  const menuSelections =
    JSON.parse(localStorage.getItem("menuSelections")) || {};
  const maintenanceData =
    JSON.parse(localStorage.getItem("maintenanceData")) || {};
  const navigate = useNavigate();
  const handleLogout = () => {
    // Redirect to the registration page
    navigate("/register");
  };
  return (
    <>
      <StyledAppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Profile
          </Typography>
          <Typography variant="body1" color="inherit">
            {userEmail}
          </Typography>
          <Button onClick={handleLogout} variant="contained">
            Logout
          </Button>
        </Toolbar>
      </StyledAppBar>
      <Container>
        <Box className="dashboard-container">
          {/* Restaurant Information */}
          <DataDisplay
            title="Restaurant Information"
            data={restaurantData[currentUserId] || {}}
            type="restaurant"
          />

          {/* Menu Selections */}
          <DataDisplay
            title="Menu Selections"
            data={menuSelections[currentUserId] || {}}
            type="menu"
          />
          <Box mt={2}>
            <Button
              component={StyledLink}
              to="/menu-list"
              variant="contained"
              color="primary"
            >
              Update Menu Selections
            </Button>
          </Box>

          {/* Maintenance Data */}
          <MaintenanceHistory
            maintenanceData={maintenanceData[currentUserId] || []}
          />
          <Box mt={2}>
            <Button
              component={StyledLink}
              to="/maintenance"
              variant="contained"
              color="primary"
            >
              Add Maintenance Record
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Dashboard;
