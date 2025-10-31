# Leave Management Backend

This is a minimal Express + MongoDB backend for a Leave Management System.

Features included in this scaffold:

- JWT authentication (register/login)
- Role enum: TeamMember, TeamLeader, TeamManager, GeneralManager, Admin
- Models: User, LeaveType, LeaveRequest
- Apply for leave, cancel pending, view history, download CSV statement
- Manager approval/rejection endpoints (with optional override)
- Seed script to create default leave types and sample users

Prerequisites

- Node.js 18+ (or compatible)
- MongoDB running locally or accessible via connection string

Setup (Windows cmd)

1. Copy environment example and set values:

```cmd
cd "d:\MERN-lab\Leave management\backend"
copy .env.example .env
:: edit .env and set MONGO_URI and JWT_SECRET
```

2. Install dependencies

```cmd
npm install
```

3. Seed the database (creates Admin / Manager / Member users)

```cmd
npm run seed
```

4. Start the server

```cmd
npm run dev
:: or
npm start
```

API (examples)

- POST /api/auth/login { email, password }
- POST /api/auth/register { name, email, password, role }
- POST /api/leaves/apply { leaveTypeId, startDate, endDate, reason } (auth)
- GET /api/leaves/me (auth)
- GET /api/leaves/pending (manager auth)
- POST /api/leaves/:id/action { action: 'approve'|'reject', override: true|false } (manager auth)
- GET /api/leaves/statement (auth) - download CSV

Notes & next steps

- Team membership and department-based approvals are simplified. For production, add Team/Department models and stricter manager->team scoping.
- Add pagination, validation, input sanitization, and unit tests.
- Add a web frontend or admin UI and deployment pipeline.
