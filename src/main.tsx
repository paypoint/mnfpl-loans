import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <Toaster />
    <div vaul-drawer-wrapper="" className="bg-white min-h-[100vh]">
      <App />
    </div>
  </BrowserRouter>
  // </React.StrictMode>
);
