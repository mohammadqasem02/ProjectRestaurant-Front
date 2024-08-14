import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = e.target.elements;

    try {
      // Send login request to the backend
      await axios.post("/api/login", {
        email: email.value,
        password: password.value,
      });

      console.log("Login successful"); // Debugging response

      // Retrieve users from localStorage
      const users = JSON.parse(localStorage.getItem("users")) || [];

      // Find the user that matches the email
      const user = users.find((user) => user.email === email.value);

      if (user) {
        // Store currentUserId and email in localStorage
        localStorage.setItem("currentUserId", user.id);
        localStorage.setItem("email", user.email); // Ensure email is stored

        // Retrieve and filter user-specific data from localStorage
        const restaurantData =
          JSON.parse(localStorage.getItem("restaurantData")) || {};
        const menuSelections =
          JSON.parse(localStorage.getItem("menuSelections")) || {};
        const maintenanceData =
          JSON.parse(localStorage.getItem("maintenanceData")) || {};

        // Filter the data for the current user
        const userRestaurantData = restaurantData[user.id] || {};
        const userMenuSelections = menuSelections[user.id] || {};
        const userMaintenanceData = maintenanceData[user.id] || {};

        // Store the filtered data in localStorage (optional, if needed)
        localStorage.setItem(
          "userRestaurantData",
          JSON.stringify(userRestaurantData)
        );
        localStorage.setItem(
          "userMenuSelections",
          JSON.stringify(userMenuSelections)
        );
        localStorage.setItem(
          "userMaintenanceData",
          JSON.stringify(userMaintenanceData)
        );

        // Navigate to the dashboard
        navigate("/dashboard");
      } else {
        alert("Invalid login credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("There was an error logging in. Please try again.");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
