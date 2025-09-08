import React, { useEffect, useState } from "react";
import { api } from "../api/client";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErr("");
      try {
        const data = await api.getMyOrders();
        setOrders(Array.isArray(data) ? data : data?.items || []);
      } catch (e) {
        setErr(e.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h1>My Orders</h1>
      {loading && <div>Loading...</div>}
      {err && <div style={{ color: "crimson" }}>{err}</div>}
      {(!loading && orders.length === 0) && <div>No orders found.</div>}
      <div style={{ display: "grid", gap: 12 }}>
        {orders.map((o) => (
          <div key={o.id} style={{ border: "1px solid var(--border-color,#e9ecef)", borderRadius: 8, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div><strong>Order #{o.id}</strong></div>
              <div>${(o.total_amount || 0).toFixed(2)}</div>
            </div>
            <div style={{ marginTop: 8 }}>
              <div>Status: {o.status || "created"}</div>
              <div>Items:</div>
              <ul>
                {(o.items || []).map((it, idx) => (
                  <li key={idx}>
                    {it.product_name || it.product_id} x {it.quantity} @ ${it.price?.toFixed ? it.price.toFixed(2) : it.price}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
