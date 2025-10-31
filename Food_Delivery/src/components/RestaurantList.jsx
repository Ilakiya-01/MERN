import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function RestaurantList() {
  const [list, setList] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  useEffect(() => {
    load();
  }, []);

  function load() {
    const params = new URLSearchParams();
    if (q) params.append("q", q);
    if (category) params.append("category", category);
    axios
      .get(`http://localhost:8000/api/restaurants?${params.toString()}`)
      .then((r) => setList(r.data));
  }
  return (
    <div className="container">
      <h2>Restaurants</h2>
      <div className="toolbar">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name"
        />
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category (e.g., Pizza)"
        />
        <button onClick={load}>Search</button>
      </div>
      <div className="grid">
        {list.map((r) => (
          <div key={r._id} className="card">
            <Link to={`/restaurant/${r._id}`} className="card-title">
              {r.name}
            </Link>
            <div className="muted">{r.description}</div>
            {r.categories?.length ? (
              <div className="chips">
                {r.categories.map((c) => (
                  <span key={c} className="chip">{c}</span>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
