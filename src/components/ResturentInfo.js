import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { motion } from "framer-motion";
import "./RestaurantInfo.css"; // Import custom CSS

const RestaurantInfo = () => {
  const [formData, setFormData] = useState({
    RestaurantName: "",
    RestaurantPhone: "",
    RestaurantStreet: "",
    StartHour: "",
    EndHour: "",
    RestaurantNear: [""], // Initialize with one empty string
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  // Retrieve current user ID from localStorage
  const userId = localStorage.getItem("currentUserId");

  // Load existing restaurant info if available
  useEffect(() => {
    if (userId) {
      const existingData =
        JSON.parse(localStorage.getItem("restaurantData")) || {};
      const userRestaurantData = existingData[userId] || {};

      if (userRestaurantData) {
        setFormData({
          ...formData,
          ...userRestaurantData,
          RestaurantNear: userRestaurantData.RestaurantNear || [""], // Ensure RestaurantNear is an array with at least one empty string
        });
      }
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("RestaurantNear")) {
      const index = parseInt(name.split("-")[1], 10);
      const updatedRestaurantNear = [...formData.RestaurantNear];
      updatedRestaurantNear[index] = value;
      setFormData({
        ...formData,
        RestaurantNear: updatedRestaurantNear,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const addRestaurantNear = () => {
    setFormData({
      ...formData,
      RestaurantNear: [...formData.RestaurantNear, ""],
    });
  };

  const validateForm = () => {
    let formErrors = {};
    let valid = true;

    if (!formData.RestaurantName) {
      formErrors.RestaurantName = "Restaurant Name is required";
      valid = false;
    }

    if (!formData.RestaurantPhone) {
      formErrors.RestaurantPhone = "Restaurant Phone is required";
      valid = false;
    }

    if (!formData.RestaurantStreet) {
      formErrors.RestaurantStreet = "Restaurant Street is required";
      valid = false;
    }

    if (!formData.StartHour) {
      formErrors.StartHour = "Start Hour is required";
      valid = false;
    }

    if (!formData.EndHour) {
      formErrors.EndHour = "End Hour is required";
      valid = false;
    }

    if (formData.RestaurantNear.some((near) => !near)) {
      formErrors.RestaurantNear = "All 'Restaurant Near' fields must be filled";
      valid = false;
    }

    setErrors(formErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        if (!userId) {
          setApiError("No user ID found. Please log in again.");
          return;
        }

        // Retrieve existing data from localStorage
        const existingData =
          JSON.parse(localStorage.getItem("restaurantData")) || {};
        existingData[userId] = formData;

        // Save updated restaurant data to localStorage
        localStorage.setItem("restaurantData", JSON.stringify(existingData));

        toast({
          title: "Success!",
          description: "Information submitted successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setFormData({
          RestaurantName: "",
          RestaurantPhone: "",
          RestaurantStreet: "",
          StartHour: "",
          EndHour: "",
          RestaurantNear: [""], // Initialize with one empty string
        });

        navigate("/menu-list");
      } catch (error) {
        setApiError("Submission failed. Please try again.");
        console.error("Submission error:", error);
      }
    }
  };

  return (
    <div className="restaurant-info-container">
      <motion.div
        className="restaurant-info-form"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Restaurant Information</h2>
        {apiError && <p className="api-error">{apiError}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="RestaurantName">Restaurant Name</label>
            <input
              type="text"
              id="RestaurantName"
              name="RestaurantName"
              placeholder="Restaurant Name"
              value={formData.RestaurantName}
              onChange={handleChange}
            />
            {errors.RestaurantName && (
              <p className="error">{errors.RestaurantName}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="RestaurantPhone">Restaurant Phone</label>
            <input
              type="text"
              id="RestaurantPhone"
              name="RestaurantPhone"
              placeholder="Restaurant Phone"
              value={formData.RestaurantPhone}
              onChange={handleChange}
            />
            {errors.RestaurantPhone && (
              <p className="error">{errors.RestaurantPhone}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="RestaurantStreet">Restaurant Street</label>
            <input
              type="text"
              id="RestaurantStreet"
              name="RestaurantStreet"
              placeholder="Restaurant Street"
              value={formData.RestaurantStreet}
              onChange={handleChange}
            />
            {errors.RestaurantStreet && (
              <p className="error">{errors.RestaurantStreet}</p>
            )}
          </div>

          {formData.RestaurantNear.map((near, index) => (
            <div className="form-group" key={index}>
              <label htmlFor={`RestaurantNear-${index}`}>Restaurant Near</label>
              <input
                type="text"
                id={`RestaurantNear-${index}`}
                name={`RestaurantNear-${index}`}
                placeholder="Restaurant Near"
                value={near}
                onChange={handleChange}
              />
              {errors.RestaurantNear && (
                <p className="error">{errors.RestaurantNear}</p>
              )}
            </div>
          ))}
          <button
            type="button"
            className="add-button"
            onClick={addRestaurantNear}
          >
            Add Another Nearby Place
          </button>

          <div className="form-group">
            <label htmlFor="StartHour">Start Hour</label>
            <input
              type="time"
              id="StartHour"
              name="StartHour"
              value={formData.StartHour}
              onChange={handleChange}
            />
            {errors.StartHour && <p className="error">{errors.StartHour}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="EndHour">End Hour</label>
            <input
              type="time"
              id="EndHour"
              name="EndHour"
              value={formData.EndHour}
              onChange={handleChange}
            />
            {errors.EndHour && <p className="error">{errors.EndHour}</p>}
          </div>

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default RestaurantInfo;
