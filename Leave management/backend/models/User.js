const mongoose = require("mongoose");

const leaveBalanceSchema = new mongoose.Schema({
  leaveType: { type: mongoose.Schema.Types.ObjectId, ref: "LeaveType" },
  entitlement: { type: Number, default: 0 },
  used: { type: Number, default: 0 },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: [
      "TeamMember",
      "TeamLeader",
      "TeamManager",
      "GeneralManager",
      "Admin",
    ],
    default: "TeamMember",
  },
  department: { type: String },
  leaveBalances: [leaveBalanceSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
