import React from "react";
import { Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import RestaurantInfo from "./components/ResturentInfo";
import MenuList from "./components/MenuList";
import MaintenanceForm from "./components/Maintenance";
import "./index.css";
function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/resturentInfo" element={<RestaurantInfo />} />
      <Route path="/menu-list" element={<MenuList />} />
      <Route path="/maintenance" element={<MaintenanceForm />} />
    </Routes>
  );
}

export default App;
