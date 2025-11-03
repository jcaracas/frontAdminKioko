// src/components/LoginForm.jsx
import React, { useState } from "react";
import { API_BASE_URL } from "../config"; 

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 🔹 Aquí deberías poner la URL real de tu backend de login
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Credenciales incorrectas");

      const data = await res.json();
      
      
      // 🔹 Guarda token y usuario en localStorage
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", data.user);
      
      

      

      // 🔹 Llama al callback del App.jsx
      onLogin(data.token, data.user);
    } catch (err) {
      setError("❌ Usuario o contraseña inválidos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 text-center">
      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: 380 }}>
        <h4 className="mb-3">Iniciar sesión</h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label className="form-label fw-bold">Usuario</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label className="form-label fw-bold">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
