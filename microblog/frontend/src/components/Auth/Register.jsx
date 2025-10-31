import { useState } from "react";
import api from "../../api/api";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      alert("Registered successfully! Now login.");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="centered-container">
      <h1 className="form-title">Register</h1>
      <form onSubmit={handleSubmit} className="form-space">
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="input"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="input"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="input"
        />
        <button type="submit" className="btn w-full">
          Register
        </button>
      </form>
    </div>
  );
}
