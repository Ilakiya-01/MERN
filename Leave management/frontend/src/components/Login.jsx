import React, { useState } from "react";
import api from "../api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const data = await api.login({ email, password });
      onLogin(data);
    } catch (err) {
      setErr(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login card">
      <div className="card-inner">
        <h2 className="card-title">Sign in</h2>
        <p className="muted">Enter your email and password to continue.</p>
        {err && <div className="error">{err}</div>}
        <form onSubmit={submit} className="form">
          <label>Email</label>
          <input
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <button className="btn" disabled={loading}>
              {loading ? "Signing..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="muted small" style={{ marginTop: 12 }}>
          Need an account? Contact your administrator to create one.
        </div>
      </div>
    </div>
  );
}
