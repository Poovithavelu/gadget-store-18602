import React from "react";

export default function Footer() {
  return (
    <footer style={{ padding: "24px 0", borderTop: "1px solid var(--border-color, #e9ecef)" }}>
      <div className="container" style={{ color: "var(--text-primary, #282c34)" }}>
        © {new Date().getFullYear()} Gadget Store. All rights reserved.
      </div>
    </footer>
  );
}
