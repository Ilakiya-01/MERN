import { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import FollowButton from "../components/Profile/FollowButton";
import { Link } from "react-router-dom";

export default function Search() {
  const [q, setQ] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (query) => {
    if (!query?.trim()) {
      setUsers([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get(`/users`, { params: { q: query } });
      setUsers(data.users || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // simple debounce
  useEffect(() => {
    const h = setTimeout(() => fetchUsers(q), 300);
    return () => clearTimeout(h);
  }, [q]);

  return (
    <div className="max-w-xl mx-auto mt-6">
      <div className="card p-4">
        <h1 className="text-xl font-bold mb-2">Search Users</h1>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by username or email"
          className="input w-full"
        />
      </div>

      {loading && <p className="mt-4">Searching...</p>}

      <div className="mt-4 space-y-3">
        {users.map((u) => (
          <div key={u._id} className="card p-3">
            <div className="flex items-center justify-between">
              <div>
                <Link
                  to={`/profile/${u._id}`}
                  className="font-semibold hover:underline"
                >
                  {u.username}
                </Link>
                <div className="text-gray-600 text-sm">{u.bio}</div>
              </div>
              <FollowButton
                targetUserId={u._id}
                initiallyFollowing={u.isFollowing}
                onToggled={() => fetchUsers(q)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
