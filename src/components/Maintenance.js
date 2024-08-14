import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const BackToDashboardLink = styled(Link)(({ theme }) => ({
  display: "inline-block",
  marginTop: theme.spacing(2),
  textDecoration: "none",
  color: theme.palette.primary.main,
  fontSize: theme.typography.body1.fontSize,
  "&:hover": {
    textDecoration: "underline",
  },
}));

const Maintenance = () => {
  const [formData, setFormData] = useState({
    maintenanceData: "",
    maintenancePrice: "",
    maintenanceDescription: "",
    maintenanceExpectData: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const navigate = useNavigate();
  const userId = localStorage.getItem("currentUserId");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send data to server (optional)
      await axios.post("/api/Maintenance", formData);

      // Retrieve existing data from localStorage
      const existingMaintenanceData =
        JSON.parse(localStorage.getItem("maintenanceData")) || {};

      // Ensure the user has an array to store their data
      if (!Array.isArray(existingMaintenanceData[userId])) {
        existingMaintenanceData[userId] = [];
      }

      // Add new maintenance data to the existing data
      existingMaintenanceData[userId].push(formData);

      // Save updated data back to localStorage
      localStorage.setItem(
        "maintenanceData",
        JSON.stringify(existingMaintenanceData)
      );

      // Clear the form
      setFormData({
        maintenanceData: "",
        maintenancePrice: "",
        maintenanceDescription: "",
        maintenanceExpectData: "",
      });

      setSnackbarMessage("Maintenance record added successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setTimeout(() => navigate("/dashboard"), 3000);
    } catch (error) {
      console.error("Error submitting data:", error);
      setSnackbarMessage(
        "There was an error submitting your maintenance data. Please try again."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          Add Maintenance Record
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Maintenance Date"
            type="date"
            name="maintenanceData"
            value={formData.maintenanceData}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Maintenance Price"
            type="number"
            name="maintenancePrice"
            value={formData.maintenancePrice}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Maintenance Description"
            name="maintenanceDescription"
            value={formData.maintenanceDescription}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            fullWidth
            label="Expected Completion Date"
            type="date"
            name="maintenanceExpectData"
            value={formData.maintenanceExpectData}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            margin="normal"
          />
          <StyledButton type="submit" variant="contained">
            Add Maintenance Record
          </StyledButton>
        </form>
        <BackToDashboardLink to="/dashboard">
          Go to Dashboard
        </BackToDashboardLink>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default Maintenance;
