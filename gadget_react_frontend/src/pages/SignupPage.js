import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function SignupPage() {
  const { signup, getLastPath, clearLastPath } = React.useContext(AuthContext);
  const [name, setName] = useState("");
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
      const res = await signup(name, email, password);
      // If signup didn't directly return token, signup handler will try auto-login.
      const target = from || "/";
      clearLastPath();
      navigate(target, { replace: true });
    } catch (e2) {
      const msg =
        e2?.data?.detail ||
        e2?.data?.message ||
        e2?.message ||
        "Signup failed";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420 }}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Name</label>
          <input
            type="text"
            required
            value={name}
            placeholder="Jane Doe"
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
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
          {loading ? "Creating account..." : "Sign Up"}
        </button>
        <div style={{ marginTop: 12 }}>
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}
