import { useState } from "react";
import "./assets/tailwind.css";

import Sidebar from "./layouts/Sidebar";
import Header from "./layouts/Header";

import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Customers from "./pages/Customer";

import NotFound from "./pages/NotFound";
import Error400 from "./pages/Error400";
import Error401 from "./pages/Error401";
import Error403 from "./pages/Error403";

import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div id="app-container" className="bg-gray-100 min-h-screen flex">
      <div id="layout-wrapper" className="flex flex-row flex-1">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div id="main-content" className="flex-1 p-4 overflow-y-auto">
          <Header />

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />

            {/*  ERROR ROUTES */}
            <Route path="/error-400" element={<Error400 />} />
            <Route path="/error-401" element={<Error401 />} />
            <Route path="/error-403" element={<Error403 />} />

            {/* NOT FOUND (HARUS TERAKHIR) */}
            <Route path="*" element={<NotFound />} />
          </Routes>

        </div>
      </div>
    </div>
  );
}

export default App;