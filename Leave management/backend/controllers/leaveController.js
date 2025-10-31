const LeaveRequest = require("../models/LeaveRequest");
const LeaveType = require("../models/LeaveType");
const User = require("../models/User");
const moment = require("moment");

// helper to compute days inclusive
const daysBetween = (start, end) => {
  const s = moment(start).startOf("day");
  const e = moment(end).startOf("day");
  return e.diff(s, "days") + 1;
};

exports.applyLeave = async (req, res) => {
  try {
    const { leaveTypeId, startDate, endDate, reason } = req.body;
    if (!leaveTypeId || !startDate || !endDate)
      return res.status(400).json({ message: "Missing fields" });
    const leaveType = await LeaveType.findById(leaveTypeId);
    if (!leaveType)
      return res.status(400).json({ message: "Invalid leave type" });
    const days = daysBetween(startDate, endDate);
    // check balance
    const balance = req.user.leaveBalances.find(
      (lb) => String(lb.leaveType) === String(leaveTypeId)
    );
    const available = balance ? balance.entitlement - balance.used : 0;
    if (available < days)
      return res
        .status(400)
        .json({ message: `Insufficient balance. Available: ${available}` });
    const lr = new LeaveRequest({
      applicant: req.user._id,
      leaveType: leaveType._id,
      startDate,
      endDate,
      days,
      reason,
      status: "Pending",
    });
    await lr.save();
    res.json(lr);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.cancelLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const lr = await LeaveRequest.findById(id);
    if (!lr) return res.status(404).json({ message: "Not found" });
    if (String(lr.applicant) !== String(req.user._id))
      return res.status(403).json({ message: "Not allowed" });
    if (lr.status !== "Pending")
      return res
        .status(400)
        .json({ message: "Only pending requests can be cancelled" });
    lr.status = "Cancelled";
    await lr.save();
    res.json({ message: "Cancelled", lr });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.myLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ applicant: req.user._id })
      .populate("leaveType")
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPendingForApproval = async (req, res) => {
  try {
    // For simplicity, return all pending leaves (in a real app we'd filter by team)
    const leaves = await LeaveRequest.find({ status: "Pending" })
      .populate("applicant leaveType")
      .sort({ startDate: 1 });
    res.json(leaves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.approveReject = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, override } = req.body; // action: 'approve' or 'reject'
    const lr = await LeaveRequest.findById(id);
    if (!lr) return res.status(404).json({ message: "Not found" });
    if (lr.status !== "Pending")
      return res
        .status(400)
        .json({ message: "Only pending requests can be actioned" });
    if (action === "approve") {
      // decrement balance
      const applicant = await User.findById(lr.applicant);
      const balance = applicant.leaveBalances.find(
        (lb) => String(lb.leaveType) === String(lr.leaveType)
      );
      if (!balance && !override)
        return res
          .status(400)
          .json({ message: "No balance for this leave type" });
      if (!override) {
        const available = balance.entitlement - balance.used;
        if (available < lr.days)
          return res
            .status(400)
            .json({ message: `Insufficient balance (${available})` });
        balance.used += lr.days;
      }
      lr.status = "Approved";
      lr.approvedBy = req.user._id;
      lr.override = !!override;
      await applicant.save();
      await lr.save();
      res.json({ message: "Approved", lr });
    } else if (action === "reject") {
      lr.status = "Rejected";
      lr.approvedBy = req.user._id;
      await lr.save();
      res.json({ message: "Rejected", lr });
    } else {
      res.status(400).json({ message: "Invalid action" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getLeaveBalances = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "leaveBalances.leaveType"
    );
    res.json(user.leaveBalances);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.generateUserStatement = async (req, res) => {
  try {
    const { userId } = req.params;
    const uid = userId || req.user._id;
    const leaves = await LeaveRequest.find({ applicant: uid }).populate(
      "leaveType"
    );
    // simple CSV
    const rows = ["Date,LeaveType,StartDate,EndDate,Days,Status,Reason"];
    leaves.forEach((l) =>
      rows.push(
        `${moment(l.createdAt).format("YYYY-MM-DD")},${
          l.leaveType.name
        },${moment(l.startDate).format("YYYY-MM-DD")},${moment(
          l.endDate
        ).format("YYYY-MM-DD")},${l.days},${l.status},"${(
          l.reason || ""
        ).replace(/\"/g, '\\"')}"`
      )
    );
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=leave-statement-${uid}.csv`
    );
    res.send(rows.join("\n"));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
