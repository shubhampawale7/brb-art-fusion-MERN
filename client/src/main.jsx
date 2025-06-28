// client/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ParallaxProvider } from "react-scroll-parallax"; // <-- 1. Import the provider
import App from "./App.jsx";
import "./assets/styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ParallaxProvider>
        {" "}
        {/* <-- 2. Wrap your App component */}
        <App />
      </ParallaxProvider>
    </BrowserRouter>
  </React.StrictMode>
);
