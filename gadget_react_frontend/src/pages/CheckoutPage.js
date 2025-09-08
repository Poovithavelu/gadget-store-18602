import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { api } from "../api/client";

export default function CheckoutPage() {
  const { items, totalPrice, clear } = React.useContext(CartContext);
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const placeOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const payload = {
        items: items.map((i) => ({ product_id: i.id, quantity: i.qty, price: i.price })),
        total_amount: totalPrice,
        shipping_address: address,
        note,
      };
      const order = await api.createOrder(payload);
      clear();
      navigate("/orders", { state: { placedOrderId: order?.id } });
    } catch (e2) {
      setErr(e2.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div>
        <h1>Checkout</h1>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Checkout</h1>
      <form onSubmit={placeOrder} style={{ maxWidth: 520 }}>
        <div style={{ marginBottom: 12 }}>
          <label>Shipping Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            rows={4}
            style={{ width: "100%", padding: 8 }}
            placeholder="Enter your shipping address"
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Order Note (optional)</label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            placeholder="Any special instructions"
          />
        </div>
        <div style={{ marginBottom: 12, fontWeight: 600 }}>
          Order Total: ${totalPrice.toFixed(2)}
        </div>
        {err && <div style={{ color: "crimson", marginBottom: 12 }}>{err}</div>}
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Placing order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
