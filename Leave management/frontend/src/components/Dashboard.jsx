import React, { useEffect, useState } from "react";
import api from "../api";

export default function Dashboard() {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .getBalances()
      .then((b) => {
        if (mounted) setBalances(b);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => (mounted = false);
  }, []);

  return (
    <div>
      <h3>Leave Balances</h3>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Entitlement</th>
              <th>Used</th>
              <th>Available</th>
            </tr>
          </thead>
          <tbody>
            {balances.map((b) => (
              <tr key={b._id}>
                <td>{b.leaveType?.name || "Unknown"}</td>
                <td>{b.entitlement}</td>
                <td>{b.used}</td>
                <td>{b.entitlement - b.used}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
