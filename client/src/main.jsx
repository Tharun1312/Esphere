import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import PropertyDetails from "./pages/PropertyDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostProperty from "./pages/PostProperty";
import ProtectedRoute from "./components/ProtectedRoute";
import BlockchainExplorer from "./pages/BlockchainExplorer";
import "./global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/property/:id" element={<PropertyDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/explorer" element={<BlockchainExplorer />} />

      <Route
        path="/post-property"
        element={
          <ProtectedRoute>
            <PostProperty />
          </ProtectedRoute>
        }
      />
    </Routes>
  </BrowserRouter>
);
