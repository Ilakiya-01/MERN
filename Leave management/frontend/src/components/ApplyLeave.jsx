import React, { useState, useEffect } from "react";
import api from "../api";

export default function ApplyLeave() {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [type, setType] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [reason, setReason] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    // get leave types from backend by fetching balances (contains leaveType)
    api
      .getBalances()
      .then((balances) => {
        setLeaveTypes(balances.map((b) => b.leaveType));
        if (balances[0]) setType(balances[0].leaveType._id);
      })
      .catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await api.applyLeave({
        leaveTypeId: type,
        startDate: start,
        endDate: end,
        reason,
      });
      setMsg("Applied — status: " + res.status);
      setStart("");
      setEnd("");
      setReason("");
    } catch (err) {
      setMsg("Error: " + err.message);
    }
  };

  return (
    <div>
      <h3>Apply Leave</h3>
      <form onSubmit={submit} className="form">
        <label>Leave Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          {leaveTypes.map((lt) => (
            <option key={lt._id} value={lt._id}>
              {lt.name}
            </option>
          ))}
        </select>
        <label>Start Date</label>
        <input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
        <label>End Date</label>
        <input
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
        <label>Reason</label>
        <input value={reason} onChange={(e) => setReason(e.target.value)} />
        <button className="btn">Apply</button>
      </form>
      {msg && <div className="msg">{msg}</div>}
    </div>
  );
}
