import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ConnectionManager from "./components/ConnectionManager";
import QueryExecutor from "./components/QueryExecutor";
import LoginForm from "./components/LoginForm";
import AdminDashboard from "./components/admin/AdminDashboard";
import { useAuthGuard } from './hooks/useAuthGuard';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Layout({ token }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && (
        <>
          <ConnectionManager token={token} />

          <QueryExecutor token={token} />

        </>
      )}

      <Routes>
        <Route path="/" element={null} />
        <Route path="/admin" element={<AdminDashboard token={token} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

const FooterContent = () => (
  <footer className="bg-light text-center p-2 mt-3 border-top">
    <p className="text-muted small mb-0">
      &copy; {new Date().getFullYear()} By Aplicaciones Tarragona. Todos los derechos reservados.
    </p>
  </footer>
);

function App() {

  const [token, setToken] = useState(localStorage.getItem("authToken") || "");
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("authUser");
      if (!saved || saved === "undefined") return null;
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  const handleLogin = (newToken, newUser) => {
    localStorage.setItem("authToken", newToken);
    localStorage.setItem("authUser", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    localStorage.removeItem("connectionStatus");
    setToken("");
    setUser(null);
    window.dispatchEvent(new Event("storage"));
  };

  // ✅ Solo usar guardia SI HAY token
  useAuthGuard();

  return (
    <>
      {!token ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <>
          <Navbar user={user} onLogout={handleLogout} />
          <div className="container mt-4">
            <Layout token={token} />
          </div>
          <FooterContent />
        </>
      )}
    </>
  );
}

export default App;
