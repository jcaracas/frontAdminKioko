// src/components/ProtectedByRole.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedByRole({ user, roles, children }) {
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/login" />;
  }
  return children;
}
