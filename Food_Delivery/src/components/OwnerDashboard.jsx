import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../utils/auth";
import { io } from "socket.io-client";

export default function OwnerDashboard() {
  const token = getToken();
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRid, setSelectedRid] = useState("");
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", description: "", category: "" });
  const [analytics, setAnalytics] = useState({ count: 0, byStatus: {}, revenue: 0 });
  const [newRestaurant, setNewRestaurant] = useState({ name: "", description: "", location: "", categories: "" });
  const [editRestaurant, setEditRestaurant] = useState({ name: "", description: "", location: "", categories: "" });
  const [editItemId, setEditItemId] = useState(null);
  const [editItemForm, setEditItemForm] = useState({ name: "", price: "", description: "", category: "" });

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/restaurants/mine", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => {
        setRestaurants(r.data);
        if (r.data[0]) {
          setSelectedRid(r.data[0]._id);
          setEditRestaurant({
            name: r.data[0].name || "",
            description: r.data[0].description || "",
            location: r.data[0].location || "",
            categories: (r.data[0].categories || []).join(", "),
          });
        }
      });
  }, [token]);

  // Keep the edit form in sync with the currently selected restaurant
  useEffect(() => {
    if (!selectedRid || !restaurants?.length) return;
    const r = restaurants.find((x) => x._id === selectedRid);
    if (r) {
      setEditRestaurant({
        name: r.name || "",
        description: r.description || "",
        location: r.location || "",
        categories: (r.categories || []).join(", "),
      });
    }
  }, [selectedRid, restaurants]);

  useEffect(() => {
    if (!selectedRid) return;
    // load orders
    axios
      .get(`http://localhost:8000/api/orders/restaurant/${selectedRid}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((o) => setOrders(o.data));
    // load menu items
    axios
      .get(`http://localhost:8000/api/menu/restaurant/${selectedRid}`)
      .then((r) => setItems(r.data));
    // load analytics
    axios
      .get(`http://localhost:8000/api/orders/restaurant/${selectedRid}/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setAnalytics(r.data));

    // socket join for live updates
    const s = io("http://localhost:8000");
    s.emit("joinRoom", `restaurant_${selectedRid}`);
    s.on("orderUpdated", (order) => {
      // Update orders list if the order belongs to this restaurant
      if (order.restaurant === selectedRid || order.restaurant?._id === selectedRid) {
        setOrders((prev) => {
          const idx = prev.findIndex((o) => o._id === order._id);
          if (idx >= 0) {
            const copy = [...prev];
            copy[idx] = order;
            return copy;
          }
          return [order, ...prev];
        });
      }
    });
    return () => {
      s.emit("leaveRoom", `restaurant_${selectedRid}`);
      s.disconnect();
    };
  }, [selectedRid, token]);

  async function updateStatus(orderId, status) {
    try {
      const res = await axios.put(
        `http://localhost:8000/api/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Updated");
      setOrders(orders.map((o) => (o._id === res.data._id ? res.data : o)));
    } catch (err) {
      alert("Update failed");
    }
  }

  async function addItem(e) {
    e.preventDefault();
    try {
      if (!form.name.trim() || !form.price) {
        alert("Name and price are required");
        return;
      }
      const res = await axios.post(
        `http://localhost:8000/api/menu/${selectedRid}`,
        { ...form, price: Number(form.price) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems([res.data, ...items]);
      setForm({ name: "", price: "", description: "", category: "" });
    } catch (err) {
      alert("Add item failed");
    }
  }

  async function deleteItem(itemId) {
    try {
      await axios.delete(`http://localhost:8000/api/menu/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(items.filter((it) => it._id !== itemId));
    } catch (err) {
      alert("Delete item failed");
    }
  }

  async function saveRestaurant(e) {
    e.preventDefault();
    try {
      const payload = {
        name: editRestaurant.name,
        description: editRestaurant.description,
        location: editRestaurant.location,
        categories: editRestaurant.categories
          ? editRestaurant.categories.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };
      const r = await axios.put(
        `http://localhost:8000/api/restaurants/${selectedRid}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRestaurants(restaurants.map((rst) => (rst._id === selectedRid ? r.data : rst)));
      alert("Restaurant updated");
    } catch {
      alert("Update failed");
    }
  }

  function startEditItem(it) {
    setEditItemId(it._id);
    setEditItemForm({
      name: it.name || "",
      price: String(it.price ?? ""),
      description: it.description || "",
      category: it.category || "",
    });
  }

  async function saveItem(itemId) {
    try {
      const res = await axios.put(
        `http://localhost:8000/api/menu/${itemId}`,
        { ...editItemForm, price: Number(editItemForm.price) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems(items.map((it) => (it._id === itemId ? res.data : it)));
      setEditItemId(null);
      setEditItemForm({ name: "", price: "", description: "", category: "" });
    } catch {
      alert("Save failed");
    }
  }

  return (
    <div className="container">
      <h2>Owner Dashboard</h2>
      <div className="row" style={{ marginBottom: 12 }}>
        <select value={selectedRid} onChange={(e) => setSelectedRid(e.target.value)}>
          {restaurants.map((r) => (
            <option key={r._id} value={r._id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid">
        <div className="card">
          <h3 className="card-title">Orders</h3>
          {orders.map((o) => (
            <div key={o._id}>
              <div>
                {o._id} - {o.status}
              </div>
              <button onClick={() => updateStatus(o._id, "accepted")}>
                Accept
              </button>
              <button onClick={() => updateStatus(o._id, "preparing")}>
                Preparing
              </button>
              <button onClick={() => updateStatus(o._id, "out_for_delivery")}>
                Out
              </button>
              <button onClick={() => updateStatus(o._id, "delivered")}>
                Delivered
              </button>
              <button onClick={() => updateStatus(o._id, "cancelled")}>
                Cancel
              </button>
            </div>
          ))}
        </div>
        <div className="card">
          <h3 className="card-title">Menu</h3>
          <form onSubmit={addItem} className="stack" style={{ marginBottom: 10 }}>
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <input
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <input
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <button type="submit">Add Item</button>
          </form>
          <div className="stack">
            {items.map((it) => (
              <div key={it._id} className="row" style={{ alignItems: "center", gap: 8 }}>
                {editItemId === it._id ? (
                  <>
                    <input
                      style={{ width: 140 }}
                      value={editItemForm.name}
                      onChange={(e) => setEditItemForm({ ...editItemForm, name: e.target.value })}
                    />
                    <input
                      style={{ width: 80 }}
                      value={editItemForm.price}
                      onChange={(e) => setEditItemForm({ ...editItemForm, price: e.target.value })}
                    />
                    <input
                      style={{ width: 120 }}
                      value={editItemForm.category}
                      onChange={(e) => setEditItemForm({ ...editItemForm, category: e.target.value })}
                    />
                    <input
                      style={{ flex: 1 }}
                      value={editItemForm.description}
                      onChange={(e) => setEditItemForm({ ...editItemForm, description: e.target.value })}
                    />
                    <button onClick={() => saveItem(it._id)}>Save</button>
                    <button onClick={() => setEditItemId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <div style={{ flex: 1 }}>
                      {it.name} - ${it.price}
                    </div>
                    <button onClick={() => startEditItem(it)}>Edit</button>
                    <button onClick={() => deleteItem(it._id)}>Delete</button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 className="card-title">Analytics</h3>
          <div className="stack">
            <div>Total Orders: {analytics.count}</div>
            <div>Delivered Revenue: ${Number(analytics.revenue || 0).toFixed(2)}</div>
            <div className="stack">
              <div className="muted">By Status</div>
              {Object.entries(analytics.byStatus || {}).map(([k,v]) => (
                <div key={k} className="row"><div style={{width:140}}>{k}</div><strong>{v}</strong></div>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <h3 className="card-title">Edit Restaurant</h3>
          <form onSubmit={saveRestaurant} className="stack">
            <input placeholder="Name" value={editRestaurant.name} onChange={(e)=>setEditRestaurant({...editRestaurant, name:e.target.value})} />
            <input placeholder="Description" value={editRestaurant.description} onChange={(e)=>setEditRestaurant({...editRestaurant, description:e.target.value})} />
            <input placeholder="Location" value={editRestaurant.location} onChange={(e)=>setEditRestaurant({...editRestaurant, location:e.target.value})} />
            <input placeholder="Categories (comma separated)" value={editRestaurant.categories} onChange={(e)=>setEditRestaurant({...editRestaurant, categories:e.target.value})} />
            <button type="submit">Save</button>
          </form>
        </div>
        <div className="card">
          <h3 className="card-title">Create Restaurant</h3>
          <form onSubmit={async (e)=>{e.preventDefault(); try {
            const payload = { name: newRestaurant.name, description: newRestaurant.description, location: newRestaurant.location, categories: newRestaurant.categories ? newRestaurant.categories.split(',').map(s=>s.trim()).filter(Boolean) : [] };
            const r = await axios.post('http://localhost:8000/api/restaurants', payload, { headers: { Authorization: `Bearer ${token}` } });
            setRestaurants([ ...restaurants, r.data ]);
            setSelectedRid(r.data._id);
            setNewRestaurant({ name:'', description:'', location:'', categories:'' });
          } catch { alert('Create failed'); }}} className="stack">
            <input placeholder="Name" value={newRestaurant.name} onChange={(e)=>setNewRestaurant({...newRestaurant, name:e.target.value})} />
            <input placeholder="Description" value={newRestaurant.description} onChange={(e)=>setNewRestaurant({...newRestaurant, description:e.target.value})} />
            <input placeholder="Location" value={newRestaurant.location} onChange={(e)=>setNewRestaurant({...newRestaurant, location:e.target.value})} />
            <input placeholder="Categories (comma separated)" value={newRestaurant.categories} onChange={(e)=>setNewRestaurant({...newRestaurant, categories:e.target.value})} />
            <button type="submit">Create</button>
          </form>
        </div>
      </div>
    </div>
  );
}
