import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { getToken, parseJwt } from "../utils/auth";
import { useParams } from "react-router-dom";

export default function OrderTracking() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const token = getToken();
  useEffect(() => {
    async function load() {
      const res = await axios.get(`http://localhost:8000/api/orders/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(res.data.find((o) => o._id === orderId));
    }
    load();
    const socket = io("http://localhost:8000", { auth: { token } });
    socket.emit("joinRoom", `customer_${parseJwt(token)?.id}`);
    socket.on("orderUpdated", (updated) => {
      if (updated._id === orderId) setOrder(updated);
      alert("Order updated: " + updated.status);
    });
    return () => socket.disconnect();
  }, [orderId, token]);

  if (!order) return <div>Loading...</div>;
  return (
    <div>
      <h2>Order {order._id}</h2>
      <div>Status: {order.status}</div>
      <div>
        Items:{" "}
        {order.items.map((i) => (
          <div key={i._id}>
            {i.name} x {i.qty}
          </div>
        ))}
      </div>
    </div>
  );
}
