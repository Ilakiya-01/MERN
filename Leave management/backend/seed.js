require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const LeaveType = require("./models/LeaveType");

const MONGO = process.env.MONGO_URI || "mongodb://localhost:27017/leave_mgmt";

const seed = async () => {
  await mongoose.connect(MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to DB for seeding");

  // clear minimal collections
  await LeaveType.deleteMany({});
  await User.deleteMany({});

  const leaveTypes = [
    {
      name: "Casual Leave",
      code: "CL",
      defaultEntitlement: 12,
      carryoverAllowed: false,
    },
    {
      name: "Medical Leave",
      code: "ML",
      defaultEntitlement: 10,
      carryoverAllowed: false,
    },
    {
      name: "Earned Leave",
      code: "EL",
      defaultEntitlement: 18,
      carryoverAllowed: true,
    },
  ];

  const created = await LeaveType.insertMany(leaveTypes);
  console.log("Inserted leave types:", created.map((l) => l.code).join(", "));

  const adminPass = await bcrypt.hash("Admin@123", 10);
  const admin = new User({
    name: "Admin",
    email: "admin@example.com",
    password: adminPass,
    role: "Admin",
    department: "HR",
  });
  // assign leave balances
  admin.leaveBalances = created.map((lt) => ({
    leaveType: lt._id,
    entitlement: lt.defaultEntitlement,
    used: 0,
  }));
  await admin.save();

  const managerPass = await bcrypt.hash("Manager@123", 10);
  const manager = new User({
    name: "Manager",
    email: "manager@example.com",
    password: managerPass,
    role: "TeamManager",
    department: "Engineering",
  });
  manager.leaveBalances = created.map((lt) => ({
    leaveType: lt._id,
    entitlement: lt.defaultEntitlement,
    used: 0,
  }));
  await manager.save();

  const memberPass = await bcrypt.hash("Member@123", 10);
  const member = new User({
    name: "Member",
    email: "member@example.com",
    password: memberPass,
    role: "TeamMember",
    department: "Engineering",
  });
  member.leaveBalances = created.map((lt) => ({
    leaveType: lt._id,
    entitlement: lt.defaultEntitlement,
    used: 0,
  }));
  await member.save();

  console.log("Seed users created: admin, manager, member");
  console.log("Admin login: admin@example.com / Admin@123");
  console.log("Manager login: manager@example.com / Manager@123");
  console.log("Member login: member@example.com / Member@123");

  await mongoose.disconnect();
  console.log("Seeding complete");
};

seed().catch((err) => {
  console.error("Seed error", err);
  process.exit(1);
});
