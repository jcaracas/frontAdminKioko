import React, { useState, useEffect, useRef } from "react";
import UserManagement from "./UsersManager";
import Reports from "./ReportsPanel";
import Logs from "./LogsViewer";
import VentasDistribuidasView from "./VentasDistribuidasView";
import UltimaVentaLocal from "./UltimaVentaLocal";
import Actualizaciones from "./Actualizaciones";
import { useLocation } from "react-router-dom";

function AdminDashboard({ token }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [visibleCount, setVisibleCount] = useState(4);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.state?.tab || "users" // default
  );

  const containerRef = useRef(null);
  const dropdownRef = useRef(null);

  const tabs = [
    { key: "users", label: "Usuarios" },
    { key: "reports", label: "Reportes" },
    { key: "logs", label: "Logs" },
    { key: "ultima-venta", label: "Distribución" },
    { key: "ventas", label: "Ventas" },
    { key: "actualizaciones", label: "Actualización POS" }
  ];

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    } else {
      setActiveTab("users");
    } 
  }, [location.state]);

  /* detectar tamaño */
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* calcular tabs SOLO en mobile */
  useEffect(() => {
    if (!isMobile) return;

    const calculateTabs = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.offsetWidth;
      const tabWidth = 80;
      const moreWidth = 60;

      let count = Math.floor(width / tabWidth);

      if (count < tabs.length) {
        count = Math.floor((width - moreWidth) / tabWidth);
      }

      setVisibleCount(count > 0 ? count : 1);
    };

    calculateTabs();
    window.addEventListener("resize", calculateTabs);

    return () => window.removeEventListener("resize", calculateTabs);
  }, [isMobile, tabs.length]);

  const visibleTabs = tabs.slice(0, visibleCount);
  const hiddenTabs = tabs.slice(visibleCount);

  /* cerrar dropdown */
  useEffect(() => {
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case "users": return <UserManagement token={token} />;
      case "reports": return <Reports token={token} />;
      case "logs": return <Logs token={token} />;
      case "ultima-venta": return <UltimaVentaLocal token={token} />;
      case "ventas": return <VentasDistribuidasView token={token} />;
      case "actualizaciones": return <Actualizaciones token={token} />;
      default: return null;
    }
  };

  return (
    <div className="container-fluid p-0">

      <h4 className="fw-bold mb-2">Panel de Administración</h4>

      {/* 🔥 DESKTOP → Bootstrap Tabs */}
      {!isMobile && (
        <ul className="nav nav-tabs mb-3">
          {tabs.map(tab => (
            <li className="nav-item" key={tab.key}>
              <button
                className={`nav-link ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* 🔥 MOBILE → Tabs dinámicos */}
      {isMobile && (
        <div className="tabs-line mb-3" ref={containerRef}>

          {visibleTabs.map(tab => (
            <button
              key={tab.key}
              className={`tab-line ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}

          {hiddenTabs.length > 0 && (
            <div className="dropdown-custom" ref={dropdownRef}>
              <button
                className="tab-line more-btn"
                onClick={() => setOpen(prev => !prev)}
              >
                ...
              </button>

              {open && (
                <div className="dropdown-menu-custom">
                  {hiddenTabs.map(tab => (
                    <div
                      key={tab.key}
                      className="dropdown-item-custom"
                      onClick={() => {
                        setActiveTab(tab.key);
                        setOpen(false);
                      }}
                    >
                      {tab.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}

      <div >
        {renderTab()}
      </div>

    </div>
  );
}

export default AdminDashboard;