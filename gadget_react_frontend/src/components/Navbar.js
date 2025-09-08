import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import "./navbar.css";

export default function Navbar() {
  const { totalItems } = React.useContext(CartContext);
  const { isAuthenticated, user, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand">
          Gadget Store
        </Link>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/cart">Cart ({totalItems})</Link>
          {isAuthenticated ? (
            <>
              <Link to="/orders">My Orders</Link>
              <button className="linklike" onClick={handleLogout} title="Logout">
                Logout {user?.name ? `(${user.name})` : ""}
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup" className="cta">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
