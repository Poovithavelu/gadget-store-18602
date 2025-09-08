import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./cart.css";

export default function CartPage() {
  const { items, removeItem, updateQty, totalPrice } = React.useContext(CartContext);
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div>
        <h1>Your Cart</h1>
        <p>Your cart is empty. <Link to="/">Browse gadgets</Link></p>
      </div>
    );
  }

  return (
    <div>
      <h1>Your Cart</h1>
      <div className="cart-list">
        {items.map((i) => (
          <div key={i.id} className="cart-item">
            <img
              src={i.image_url || "https://via.placeholder.com/120x90?text=Gadget"}
              alt={i.name}
            />
            <div className="cart-info">
              <div className="name">{i.name}</div>
              <div className="price">${(i.price || 0).toFixed(2)}</div>
              <div className="qty">
                <label>Qty:</label>
                <input
                  type="number"
                  min={1}
                  value={i.qty}
                  onChange={(e) => updateQty(i.id, parseInt(e.target.value || "1", 10))}
                />
              </div>
              <button className="linklike danger" onClick={() => removeItem(i.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div>Total: ${totalPrice.toFixed(2)}</div>
        <button className="btn" onClick={() => navigate("/checkout")}>Proceed to Checkout</button>
      </div>
    </div>
  );
}
