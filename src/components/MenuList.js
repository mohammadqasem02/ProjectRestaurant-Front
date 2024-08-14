import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Snackbar,
  Alert,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Checkbox,
  Button,
  Fade,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import "./MenuList.css"; // Import custom CSS

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  margin: theme.spacing(2),
  transition: "transform 0.3s ease-in-out",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
  position: "relative",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.2)",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  padding: theme.spacing(1.5, 3),
  borderRadius: "8px",
  textTransform: "none",
  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.3)",
  },
}));

const LoadingBackdrop = styled(Backdrop)(({ theme }) => ({
  color: "#fff",
  zIndex: theme.zIndex.drawer + 1,
}));

const MenuList = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("currentUserId");

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get("/api/menu");
        setMenuItems(response.data);
        setLoading(false);

        const existingSelections =
          JSON.parse(localStorage.getItem("menuSelections")) || {};
        const userSelections = existingSelections[currentUserId] || {};
        setSelectedItems(userSelections);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    if (currentUserId) {
      fetchMenuItems();
    } else {
      navigate("/login");
    }
  }, [currentUserId, navigate]);

  const handleCheckboxChange = (menuItem) => {
    setSelectedItems((prevState) => {
      const isChecked = !prevState[menuItem.foodId]?.checked;

      if (!isChecked) {
        const { [menuItem.foodId]: _, ...rest } = prevState;
        return rest;
      }

      return {
        ...prevState,
        [menuItem.foodId]: {
          checked: isChecked,
          morning: false,
          noon: false,
          evening: false,
          image: menuItem.foodImg,
          price: menuItem.foodPrice,
        },
      };
    });
  };

  const handleTimeCheckboxChange = (event, menuItem, time) => {
    const isChecked = event.target.checked;
    setSelectedItems((prevState) => ({
      ...prevState,
      [menuItem.foodId]: {
        ...prevState[menuItem.foodId],
        [time]: isChecked,
      },
    }));
  };

  const handleSubmit = () => {
    const invalidSelections = Object.entries(selectedItems).filter(
      ([, value]) =>
        value.checked && !value.morning && !value.noon && !value.evening
    );

    if (invalidSelections.length > 0) {
      setSnackbarMessage(
        "Please select at least one time (morning, noon, evening) for each selected menu item."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const existingSelections =
        JSON.parse(localStorage.getItem("menuSelections")) || {};
      existingSelections[currentUserId] = selectedItems;
      localStorage.setItem(
        "menuSelections",
        JSON.stringify(existingSelections)
      );

      setSnackbarMessage("Selections saved successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setTimeout(() => navigate("/maintenance"), 3000);
    } catch (error) {
      console.error("Error saving selections", error);
      setSnackbarMessage(
        "There was an error saving your selections. Please try again."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading)
    return (
      <LoadingBackdrop open={loading}>
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading your menu...
        </Typography>
      </LoadingBackdrop>
    );

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="menu-list-container">
      <h1 className="menu-list-title">Menu</h1>
      <div className="menu-items">
        {menuItems.length > 0 ? (
          menuItems.map((item) => (
            <Fade in={true} key={item.foodId}>
              <StyledCard>
                <CardMedia
                  component="img"
                  height="180"
                  image={item.foodImg}
                  alt={item.name}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent>
                  <div className="checkbox-container">
                    <Checkbox
                      checked={selectedItems[item.foodId]?.checked || false}
                      onChange={() => handleCheckboxChange(item)}
                    />{" "}
                    Select Item
                  </div>
                  <Typography gutterBottom variant="h5" component="div">
                    {item.name}
                  </Typography>
                  <Typography variant="h6" color="text.primary">
                    ${item.foodPrice.toFixed(2)}
                  </Typography>
                  <div className="time-options">
                    <Typography variant="body2" color="text.secondary">
                      Available Times:
                    </Typography>
                    <Checkbox
                      checked={selectedItems[item.foodId]?.morning || false}
                      onChange={(e) =>
                        handleTimeCheckboxChange(e, item, "morning")
                      }
                      disabled={!selectedItems[item.foodId]?.checked}
                    />{" "}
                    Morning
                    <Checkbox
                      checked={selectedItems[item.foodId]?.noon || false}
                      onChange={(e) =>
                        handleTimeCheckboxChange(e, item, "noon")
                      }
                      disabled={!selectedItems[item.foodId]?.checked}
                    />{" "}
                    Noon
                    <Checkbox
                      checked={selectedItems[item.foodId]?.evening || false}
                      onChange={(e) =>
                        handleTimeCheckboxChange(e, item, "evening")
                      }
                      disabled={!selectedItems[item.foodId]?.checked}
                    />{" "}
                    Evening
                  </div>
                </CardContent>
              </StyledCard>
            </Fade>
          ))
        ) : (
          <p>No menu items available.</p>
        )}
      </div>
      <StyledButton
        onClick={handleSubmit}
        disabled={Object.keys(selectedItems).length === 0}
      >
        Save Selections
      </StyledButton>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MenuList;
