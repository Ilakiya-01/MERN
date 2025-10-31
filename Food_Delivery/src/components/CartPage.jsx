import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart") || "[]")
  );
  const nav = useNavigate();
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  function updateQty(i, delta) {
    const next = cart.map((c, idx) =>
      idx === i ? { ...c, qty: Math.max(1, c.qty + delta) } : c
    );
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
  }
  function remove(i) {
    const next = cart.filter((_, idx) => idx !== i);
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
  }
  return (
    <div>
      <h2>Cart</h2>
      {cart.map((c, idx) => (
        <div key={idx}>
          {c.name} - ${c.price} x {c.qty}
          <button onClick={() => updateQty(idx, -1)}>-</button>
          <button onClick={() => updateQty(idx, 1)}>+</button>
          <button onClick={() => remove(idx)}>Remove</button>
        </div>
      ))}
      <div>Subtotal: ${subtotal.toFixed(2)}</div>
      <button onClick={() => nav("/checkout")}>Checkout</button>
    </div>
  );
}
