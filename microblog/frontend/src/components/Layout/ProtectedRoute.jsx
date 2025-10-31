import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // ✅ correct path

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
