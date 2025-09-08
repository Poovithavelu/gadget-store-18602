import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { CartContext } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const { addItem } = React.useContext(CartContext);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErr("");
      try {
        const data = await api.getProduct(id);
        setP(data);
      } catch (e) {
        setErr(e.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (err) return <div style={{ color: "crimson" }}>{err}</div>;
  if (!p) return <div>Product not found</div>;

  return (
    <div className="product-detail">
      <div className="image">
        <img
          src={p.image_url || "https://via.placeholder.com/480x320?text=Gadget"}
          alt={p.name}
          style={{ maxWidth: "100%", borderRadius: 8 }}
        />
      </div>
      <div className="details">
        <h2>{p.name}</h2>
        <div className="price">${(p.price || 0).toFixed(2)}</div>
        <p>{p.description || "No description available."}</p>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label htmlFor="qty">Qty:</label>
          <input
            id="qty"
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(parseInt(e.target.value || "1", 10))}
            style={{ width: 80, padding: 6 }}
          />
          <button className="btn" onClick={() => addItem(p, qty)}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
