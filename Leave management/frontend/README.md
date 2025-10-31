# Leave Management Frontend (Vite + React)

This is a minimal frontend to interact with the Leave Management backend.

Setup (Windows cmd):

```cmd
cd "d:\MERN-lab\Leave management\frontend"
npm install
npm run dev
```

By default the frontend expects the backend at `http://localhost:5000`. To change, set environment variable in `.env` or create a `vite` env var `VITE_API_BASE`.

Demo users may be created if you ran the backend seed script. See the backend `README.md` for seed instructions and credentials. Otherwise create users via the backend or ask your administrator.

Pages included:

- Login
- Dashboard (balances)
- Apply Leave
- Manager Approvals (for manager roles)
