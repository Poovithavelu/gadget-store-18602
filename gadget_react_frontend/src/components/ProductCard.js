import React from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addItem } = React.useContext(CartContext);

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="thumb" aria-label={product.name}>
        <img
          src={product.image_url || "https://via.placeholder.com/300x200?text=Gadget"}
          alt={product.name}
        />
      </Link>
      <div className="info">
        <Link to={`/product/${product.id}`} className="name">{product.name}</Link>
        <div className="price">${(product.price || 0).toFixed(2)}</div>
        <button className="btn" onClick={() => addItem(product, 1)}>Add to Cart</button>
      </div>
    </div>
  );
}
