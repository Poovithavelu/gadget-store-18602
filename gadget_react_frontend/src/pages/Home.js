import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import ProductCard from "../components/ProductCard";
import "./products.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async (params = {}) => {
    setLoading(true);
    setErr("");
    try {
      const data = await api.getProducts(params);
      setProducts(Array.isArray(data) ? data : data?.items || []);
    } catch (e) {
      setErr(e.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    load(q ? { q } : {});
  };

  return (
    <div>
      <h1>Latest Gadgets</h1>
      <form onSubmit={onSearch} style={{ margin: "16px 0" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search gadgets..."
          style={{ padding: 8, minWidth: 240, marginRight: 8 }}
        />
        <button className="btn" type="submit">Search</button>
      </form>
      {loading && <div>Loading...</div>}
      {err && <div style={{ color: "crimson" }}>{err}</div>}
      <div className="grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
