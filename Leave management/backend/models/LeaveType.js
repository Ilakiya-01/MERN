const mongoose = require("mongoose");

const leaveTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  defaultEntitlement: { type: Number, default: 0 },
  carryoverAllowed: { type: Boolean, default: false },
});

module.exports = mongoose.model("LeaveType", leaveTypeSchema);
