const BASE = import.meta.env.VITE_API_BASE
  ? import.meta.env.VITE_API_BASE
  : "http://localhost:5000";
let token = "";

const setToken = (t) => {
  token = t;
};

const headers = (h = {}) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
  ...h,
});

const request = async (path, opts = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    headers: headers(opts.headers || {}),
    ...opts,
  });
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "API error");
  return data;
};

export default {
  setToken,
  login: (body) =>
    request("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
  register: (body) =>
    request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getBalances: () => request("/api/leaves/balances"),
  applyLeave: (body) =>
    request("/api/leaves/apply", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  myLeaves: () => request("/api/leaves/me"),
  pending: () => request("/api/leaves/pending"),
  action: (id, body) =>
    request(`/api/leaves/${id}/action`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
