import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const { login, getLastPath, clearLastPath } = React.useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || getLastPath() || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await login(email, password);
      if (!res || !res.access_token) {
        throw new Error("No access token returned from server");
      }
      const target = from || "/";
      clearLastPath();
      navigate(target, { replace: true });
    } catch (e2) {
      const msg =
        e2?.data?.detail ||
        e2?.data?.message ||
        e2?.message ||
        "Login failed";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420 }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Password</label>
          <input
            type="password"
            required
            value={password}
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        {err && <div style={{ color: "crimson", marginBottom: 12 }}>{err}</div>}
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
        <div style={{ marginTop: 12 }}>
          New here? <Link to="/signup">Create an account</Link>
        </div>
      </form>
    </div>
  );
}
