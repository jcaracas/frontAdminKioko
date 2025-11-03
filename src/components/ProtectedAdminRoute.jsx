import { Navigate } from "react-router-dom";

export default function ProtectedAdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user?.role) return <Navigate to="/login" />;
  if (user.role !== "Admin") return <Navigate to="/" />;

  return children;
}
