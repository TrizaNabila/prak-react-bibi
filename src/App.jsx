import { Suspense } from "react";
import React from "react";
import "./assets/tailwind.css";
import Loading from "./components/Loading";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

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
const Users = React.lazy(() => import("./pages/Users"));
const Error403 = React.lazy(() => import("./pages/Error403"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* 1. Grup Main Layout (Halaman dengan Sidebar) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/orders" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Orders />
            </ProtectedRoute>
          } />
          
          <Route path="/customers" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Customers />
            </ProtectedRoute>
          } />
          
          <Route path="/fitur-xyz" element={
            <ProtectedRoute>
              <FiturXyz />
            </ProtectedRoute>
          } />
          
          <Route path="/notes" element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          } />
          
          <Route path="/users" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Users />
            </ProtectedRoute>
          } />
          
          {/* Route Products */}
          <Route path="/products" element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }/>
          <Route path="/products/:id" element={
            <ProtectedRoute>
              <ProductDetail />
            </ProtectedRoute>
          } />
        </Route>

        {/* 2. Grup Auth Layout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route>

        {/* Error pages directly accessible or protected */}
        <Route path="/error-403" element={<Error403 />} />

        {/* 3. Catch-all Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;