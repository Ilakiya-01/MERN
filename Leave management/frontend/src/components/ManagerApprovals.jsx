import React, { useEffect, useState } from "react";
import api from "../api";

export default function ManagerApprovals() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = () => {
    setLoading(true);
    setErr("");
    api
      .pending()
      .then((p) => setPending(p))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const action = async (id, act) => {
    try {
      await api.action(id, { action: act, override: false });
      load();
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (err) return <div className="error">{err}</div>;

  return (
    <div>
      <h3>Pending Approvals</h3>
      {pending.length === 0 && <div>No pending requests</div>}
      <table className="table">
        <thead>
          <tr>
            <th>Applicant</th>
            <th>Type</th>
            <th>Start</th>
            <th>End</th>
            <th>Days</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pending.map((p) => (
            <tr key={p._id}>
              <td>{p.applicant?.name}</td>
              <td>{p.leaveType?.name}</td>
              <td>{new Date(p.startDate).toLocaleDateString()}</td>
              <td>{new Date(p.endDate).toLocaleDateString()}</td>
              <td>{p.days}</td>
              <td>
                <button
                  className="btn small"
                  onClick={() => action(p._id, "approve")}
                >
                  Approve
                </button>
                <button
                  className="btn small"
                  onClick={() => action(p._id, "reject")}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
