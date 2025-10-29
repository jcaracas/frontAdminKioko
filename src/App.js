// src/App.jsx
import React, { useState } from "react";
import ConnectionManager from "./components/ConnectionManager";
import QueryExecutor from "./components/QueryExecutor";
import LoginForm from "./components/LoginForm";
import LogsViewer from "./components/LogsViewer";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("authToken") || "");
  const [username, setUsername] = useState(localStorage.getItem("authUser") || "");

  // 🔹 Login exitoso
  const handleLogin = (newToken, newUser) => {
    setToken(newToken);
    setUsername(newUser);
  };

  // 🔹 Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    localStorage.removeItem("connectedConnectionId");
    localStorage.removeItem("connectedConnectionName");
    localStorage.removeItem("connectionStatus");
    setToken("");
    setUsername("");
    window.dispatchEvent(new Event("storage"));
  };

  // 🔹 Si no hay token, mostrar formulario de login
  if (!token) return <LoginForm onLogin={handleLogin} />;

  return (
    <>
      {/* 🔷 Navbar */}
      <nav className="navbar navbar-expand-lg bg-primary shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold">
            <i className="bi bi-cpu me-2"></i>Administrador de Menu
          </span>

          <div className="ms-auto d-flex align-items-center">
            <span className="text-light me-3">
              <i className="bi bi-person-circle me-1"></i>
              {username}
            </span>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i>
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      {/* 🔹 Contenido principal */}
      <div className="container mt-4">
        <ConnectionManager token={token} />
        <hr />
        <QueryExecutor token={token} />
        <hr />
        <LogsViewer token={token} />
      </div>
    </>
  );
}

export default App;
