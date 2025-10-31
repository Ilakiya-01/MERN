const express = require("express");
const router = express.Router();
const leaveCtrl = require("../controllers/leaveController");
const { auth, authorizeRoles } = require("../middleware/auth");

// apply for leave
router.post("/apply", auth, leaveCtrl.applyLeave);
// cancel
router.post("/:id/cancel", auth, leaveCtrl.cancelLeave);
// my leaves
router.get("/me", auth, leaveCtrl.myLeaves);
// balances
router.get("/balances", auth, leaveCtrl.getLeaveBalances);
// download statement
router.get("/statement/:userId?", auth, leaveCtrl.generateUserStatement);

// manager endpoints
router.get(
  "/pending",
  auth,
  authorizeRoles("TeamLeader", "TeamManager", "GeneralManager", "Admin"),
  leaveCtrl.getPendingForApproval
);
router.post(
  "/:id/action",
  auth,
  authorizeRoles("TeamLeader", "TeamManager", "GeneralManager", "Admin"),
  leaveCtrl.approveReject
);

module.exports = router;
