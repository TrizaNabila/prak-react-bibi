import { Suspense } from "react";
import React from "react";
import "./assets/tailwind.css";
import Loading from "./components/Loading";
import { Route, Routes } from "react-router-dom";

// Lazy Loading Components
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Orders = React.lazy(() => import("./pages/Orders"));
const Customers = React.lazy(() => import("./pages/Customer"));
const Products = React.lazy(() => import("./pages/Products")); 
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const MainLayout = React.lazy(() => import("./layouts/MainLayout"));
const AuthLayout = React.lazy(() => import("./layouts/AuthLayout"));
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const Forgot = React.lazy(() => import("./pages/auth/Forgot"));
const FiturXyz = React.lazy(() => import("./pages/FiturXyz"));
const Notes = React.lazy(() => import("./pages/auth/Notes"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* 1. Grup Main Layout (Halaman dengan Sidebar) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          
          {/* 🔥 SEHARUSNYA DI SINI (Di dalam MainLayout agar sidebar & layout dashboard tetap tampil) */}
          <Route path="/fitur-xyz" element={<FiturXyz />} />
          <Route path="/notes" element={<Notes />} />
          
          {/* Route Products */}
          <Route path="/products" element={<Products />}/>
          <Route path="/products/:id" element={<ProductDetail />} />
        </Route>

        {/* 2. Grup Auth Layout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route>

        {/* 3. Catch-all Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;