import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../utils/auth";

export default function Profile() {
  const token = getToken();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ username: "", email: "", address: "", role: "" });

  useEffect(() => {
    async function load() {
      try {
        const r = await axios.get("http://localhost:8000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData({
          username: r.data.username || "",
          email: r.data.email || "",
          address: r.data.address || "",
          role: r.data.role || "",
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  async function save(e) {
    e.preventDefault();
    await axios.put(
      "http://localhost:8000/api/auth/me",
      { username: data.username, address: data.address },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Profile updated");
  }

  if (loading) return <div>Loading...</div>;
  return (
    <div className="container">
      <h2>My Profile</h2>
      <form onSubmit={save} className="stack" style={{maxWidth:480}}>
        <label className="muted">Email</label>
        <input value={data.email} readOnly />
        <label className="muted">Username</label>
        <input value={data.username} onChange={(e)=>setData({...data, username:e.target.value})} />
        <label className="muted">Address</label>
        <input value={data.address} onChange={(e)=>setData({...data, address:e.target.value})} />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
