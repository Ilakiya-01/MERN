import { Navigate } from "react-router-dom";
import { getToken, parseJwt } from "../utils/auth";

export default function PrivateRoute({ children, ownerOnly = false }) {
  const token = getToken();
  if (!token) return <Navigate to="/login" replace />;
  const payload = parseJwt(token);
  if (ownerOnly && payload?.role !== "owner" && payload?.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return children;
}
