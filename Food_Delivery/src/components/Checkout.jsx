import axios from "axios";
import { getToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Checkout() {
  const nav = useNavigate();
  const token = getToken();
  const [address, setAddress] = useState("");
  if (!token) {
    nav("/login");
    return null;
  }

  useEffect(() => {
    async function loadAddress() {
      try {
        const r = await axios.get("http://localhost:8000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddress(r.data?.address || "");
      } catch {}
    }
    loadAddress();
  }, [token]);

  async function placeOrder() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (!cart.length) {
      alert("Cart empty");
      return;
    }
    // derive restaurantId from cart (single-restaurant enforced in MenuPage)
    const restaurantId = cart[0]?.restaurantId;
    if (!restaurantId) {
      alert("Missing restaurant in cart");
      return;
    }
    const items = cart.map((c) => ({ itemId: c.itemId, qty: c.qty }));
    try {
      const res = await axios.post(
        "http://localhost:8000/api/orders",
        { restaurantId, items, deliveryAddress: address || "" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const order = res.data;
      // Join socket room for updates
      // Save order id to track
      localStorage.removeItem("cart");
      nav(`/track/${order._id}`);
    } catch (err) {
      alert(err.response?.data?.error || "Order failed");
    }
  }

  return (
    <div>
      <h2>Checkout</h2>
      <div className="stack" style={{maxWidth:480, marginBottom:16}}>
        <label className="muted">Delivery Address</label>
        <input value={address} onChange={(e)=>setAddress(e.target.value)} placeholder="Enter delivery address" />
      </div>
      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
}
