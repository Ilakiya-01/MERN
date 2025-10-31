import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function OrderHistory() {
  const token = getToken();
  const nav = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const r = await axios.get("http://localhost:8000/api/orders/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(r.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  function reorder(order) {
    if (!order?.items?.length) return;
    const cart = order.items.map((i) => ({
      itemId: i.item,
      name: i.name,
      price: i.price,
      qty: i.qty,
      restaurantId: order.restaurant,
    }));
    localStorage.setItem("cart", JSON.stringify(cart));
    nav("/checkout");
  }

  if (loading) return <div>Loading...</div>;
  return (
    <div className="container">
      <h2>Order History</h2>
      <div className="stack">
        {orders.map((o) => (
          <div key={o._id} className="card">
            <div className="row" style={{justifyContent:"space-between"}}>
              <div>
                <div className="card-title">Order {o._id}</div>
                <div className="muted">Status: {o.status}</div>
              </div>
              <button onClick={() => reorder(o)}>Reorder</button>
            </div>
            <div className="muted" style={{marginTop:8}}>Items:</div>
            <div className="stack">
              {o.items.map((i) => (
                <div key={i._id} className="row" style={{justifyContent:"space-between"}}>
                  <div>{i.name} x {i.qty}</div>
                  <div>${(i.price * i.qty).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div className="row" style={{justifyContent:"flex-end", marginTop:8}}>
              <strong>Subtotal: ${Number(o.subtotal || 0).toFixed(2)}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
