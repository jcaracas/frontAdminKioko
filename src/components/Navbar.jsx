// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  // Accedemos directamente a la prop 'user' que viene de App.jsx
  const role = user?.role;
  
  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
            <img src="T.png" alt="Logo de BD Manager" style={{ height: '28px', width: 'auto', marginRight: '8px' }} 
                //className="rounded"  Opcional: añade esquinas redondeadas
                onError={(e) => { 
                // Fallback en caso de que la URL no cargue
                e.target.style.display = 'none'; 
                console.error("No se pudo cargar la imagen del logo.");
                }}
            /> BD Manager
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Panel de Gestion</Link>
            </li>

            {role === "Admin" && (
                <li className="nav-item">
                    <button className="nav-link btn btn-link" onClick={() => navigate("/admin")}>
                    Administración
                    </button>
                </li>
                )}
          </ul>

          <span className="navbar-text me-3 text-light">
            {user?.full_name} ({user?.role})
          </span>

          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
