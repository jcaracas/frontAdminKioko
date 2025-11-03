// src/components/AdminDashboard.jsx
import React, { useState } from "react";
import UserManagement from "./UsersManager";
import Reports from "./ReportsPanel";
import Logs from "./LogsViewer";

function AdminDashboard({ token }) {
  const [activeTab, setActiveTab] = useState("users");

  const renderTab = () => {
    switch (activeTab) {
      case "users": return <UserManagement token={token} />;
      case "reports": return <Reports token={token} />;
      case "logs": return <Logs token={token} />;
      default: return null;
    }
  };

  return (
    <div className="card p-4 shadow-sm">
      <h3 className="mb-4">Panel de Administración</h3>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}>
            Usuarios
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => setActiveTab("reports")}>
            Reportes
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "logs" ? "active" : ""}`}
            onClick={() => setActiveTab("logs")}>
            Logs del Sistema
          </button>
        </li>
      </ul>

      {renderTab()}
    </div>
  );
}

export default AdminDashboard;
