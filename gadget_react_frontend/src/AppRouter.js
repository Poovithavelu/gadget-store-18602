import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OrdersPage from "./pages/OrdersPage";

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = React.useContext(AuthContext);
  const location = useLocation();
  if (loading) return <div className="container" style={{ padding: 24 }}>Loading...</div>;
  if (isAuthenticated) return children;

  // Remember where the user was trying to go
  try {
    localStorage.setItem("lastProtectedPath", location.pathname + location.search);
  } catch {
    // ignore
  }
  return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
}

// PUBLIC_INTERFACE
export default function AppRouter() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="app-shell">
            <Navbar />
            <main className="container" style={{ minHeight: "70vh" }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<CartPage />} />
                <Route
                  path="/checkout"
                  element={
                    <PrivateRoute>
                      <CheckoutPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <PrivateRoute>
                      <OrdersPage />
                    </PrivateRoute>
                  }
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
