// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import ArticlesPage from "../articles/ArticlesPage";
import MenuLocales from "./MenuLocales";
import LocalHorariosBasePage from "../horarios/HorariosBasePage";

function DashMenu({ token, role }) {
  const isZonal = role === "Zonal";

  const [activeTab, setActiveTab] = useState(
    isZonal ? "horarios-base" : "menu-locales"
  );

  // ===============================
  // Evitar tabs inválidas por rol
  // ===============================
  useEffect(() => {
    if (isZonal && activeTab !== "horarios-base") {
      setActiveTab("horarios-base");
    }
  }, [isZonal, activeTab]);

  const renderTab = () => {
    if (isZonal) {
      return <LocalHorariosBasePage token={token} />;
    }

    switch (activeTab) {
      case "menu-locales":
        return <MenuLocales token={token} />;
      case "articulos":
        return <ArticlesPage token={token} />;
      case "horarios-base":
        return <LocalHorariosBasePage token={token} />;
      default:
        return null;
    }
  };

  return (
    <div className="card p-4 shadow-sm">
      <h3 className="mb-4">Administración</h3>

      {/* ===============================
          MENÚ DE TABS
      =============================== */}
      <ul className="nav nav-tabs mb-3">

        {!isZonal && (
          <>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "menu-locales" ? "active" : ""}`}
                onClick={() => setActiveTab("menu-locales")}
              >
                Menú Locales
              </button>
            </li>

            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "articulos" ? "active" : ""}`}
                onClick={() => setActiveTab("articulos")}
              >
                Artículos
              </button>
            </li>
          </>
        )}

        {/* ESTA SIEMPRE EXISTE */}
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "horarios-base" ? "active" : ""}`}
            onClick={() => setActiveTab("horarios-base")}
          >
            Horarios Locales
          </button>
        </li>
      </ul>

      {renderTab()}
    </div>
  );
}

export default DashMenu;
