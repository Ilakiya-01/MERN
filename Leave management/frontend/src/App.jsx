import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ManagerApprovals from "./components/ManagerApprovals";
import ApplyLeave from "./components/ApplyLeave";
import api from "./api";

export default function App() {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [view, setView] = useState("dashboard");

  useEffect(() => {
    if (token) api.setToken(token);
  }, [token]);

  const onLogin = (data) => {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  if (!user)
    return (
      <div id="root">
        <Login onLogin={onLogin} />
      </div>
    );

  return (
    <div>
      <header className="topbar">
        <h2>Leave Management</h2>
        <div>
          <strong>{user.name}</strong> <small>({user.role})</small>
          <button onClick={logout} className="btn">
            Logout
          </button>
        </div>
      </header>

      <nav className="nav">
        <button onClick={() => setView("dashboard")} className="btn">
          Dashboard
        </button>
        <button onClick={() => setView("apply")} className="btn">
          Apply Leave
        </button>
        {["TeamLeader", "TeamManager", "GeneralManager", "Admin"].includes(
          user.role
        ) && (
          <button onClick={() => setView("approvals")} className="btn">
            Approvals
          </button>
        )}
      </nav>

      <main className="container">
        {view === "dashboard" && <Dashboard />}
        {view === "apply" && <ApplyLeave />}
        {view === "approvals" && <ManagerApprovals />}
      </main>
    </div>
  );
}
