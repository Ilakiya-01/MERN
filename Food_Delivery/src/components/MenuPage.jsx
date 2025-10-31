import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function MenuPage() {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/menu/restaurant/${id}`)
      .then((r) => setItems(r.data));
  }, [id]);

  function addToCart(item) {
    const input = prompt("Quantity?", "1");
    const qty = Math.max(1, Number(input || 1));
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    // Enforce single-restaurant cart
    if (cart.length && cart[0].restaurantId !== id) {
      if (!confirm("Cart has items from another restaurant. Clear cart?")) {
        return;
      }
      localStorage.removeItem("cart");
      cart.length = 0;
    }
    const existing = cart.find((c) => c.itemId === item._id);
    if (existing) existing.qty += qty;
    else
      cart.push({
        itemId: item._id,
        name: item.name,
        price: item.price,
        qty,
        restaurantId: id,
      });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  }

  return (
    <div>
      <h2>Menu</h2>
      {items.map((it) => (
        <div key={it._id}>
          <h4>
            {it.name} - ${it.price}
          </h4>
          <div>{it.description}</div>
          <button onClick={() => addToCart(it)}>Add</button>
        </div>
      ))}
      <button onClick={() => nav("/cart")}>Go to Cart</button>
    </div>
  );
}
