import React, { useEffect, useState, useCallback } from "react";

function ConnectionManager({ token }) {
  const [connections, setConnections] = useState([]);
  const [selected, setSelected] = useState("");
  const [message, setMessage] = useState("");
  const [connectedId, setConnectedId] = useState(localStorage.getItem("connectedConnectionId") || "");
  // 🧩 Formulario de nueva conexión / edición
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", host: "", codLocal: "" });

  // 🔹 Cargar lista
    // ✅ Definir fetchConnections con useCallback
    const fetchConnections = useCallback(async () => {
      try {
        const res = await fetch("http://localhost:3000/connections", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al cargar conexiones");
        const data = await res.json();
  
        // ordenar por codLocal si existe
        const sorted = [...data].sort((a, b) => {
          if (a.codLocal && b.codLocal) {
            if (!isNaN(a.codLocal) && !isNaN(b.codLocal)) return Number(a.codLocal) - Number(b.codLocal);
            return String(a.codLocal).localeCompare(String(b.codLocal));
          }
          return a.id - b.id;
        });
  
        setConnections(sorted);
      } catch (err) {
        setMessage("❌ No se pudieron cargar las conexiones");
      }
    }, [token]); // ✅ token como dependencia

  // ✅ useEffect solo depende de fetchConnections
  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  // 🔹 Probar conexión
  const handleTestConnection = async (id) => {
    setMessage("⏳ Probando conexión...");
    try {
      const res = await fetch(`http://localhost:3000/connections/test/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessage(data.message || (data.success ? "Conexión OK" : "Error"));

      if (data.success) {
        const connection = connections.find((c) => String(c.id) === String(id));
        if (connection) {
          localStorage.setItem("connectedConnectionId", id);
          localStorage.setItem("connectedConnectionName", connection.name || "");
          localStorage.setItem("connectionStatus", "OK");
          setConnectedId(String(id));
          window.dispatchEvent(new Event("storage"));
        }
      } else {
        localStorage.removeItem("connectedConnectionId");
        localStorage.removeItem("connectedConnectionName");
        localStorage.removeItem("connectionStatus");
        setConnectedId("");
        window.dispatchEvent(new Event("storage"));
      }
    } catch {
      setMessage("❌ Error al intentar conectar");
    }
  };

  // 🔍 Buscar por CodLocal en BD interna
  const checkCodLocal = async (value) => {
    setForm((prev) => ({ ...prev, codLocal: value }));

    if (!value) {
      setEditing(false);
      setForm({ name: "", host: "", codLocal: "" });
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/connections/by-codlocal/${value}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.id) {
          // ✅ Existe conexión → modo edición
          setEditing(true);
          setForm({
            name: data.name || "",
            host: data.host || "",
            codLocal: data.codLocal || value,
            id: data.id,
          });
        } else {
          // ❌ No existe → modo agregar
          setEditing(false);
          setForm({ name: "", host: "", codLocal: value });
        }
      }
    } catch (err) {
      console.error("Error al verificar CodLocal", err);
    }
  };

  // ➕ Crear nueva conexión
  const addConnection = async () => {
    try {
      const res = await fetch("http://localhost:3000/connections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setMessage(data.message || "Conexión agregada");
      setForm({ name: "", host: "", codLocal: "" });
      setEditing(false);
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      setMessage("❌ Error al agregar conexión");
    }
  };

  // 💾 Actualizar conexión existente
  const updateConnection = async () => {
    try {
      const res = await fetch(`http://localhost:3000/connections/${form.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setMessage(data.message || "Conexión actualizada");
      setEditing(false);
      setForm({ name: "", host: "", codLocal: "" });
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      setMessage("❌ Error al actualizar conexión");
    }
  };

  // 🗑️ Eliminar conexión
  const deleteConnection = async () => {
    if (!window.confirm("¿Seguro que deseas eliminar esta conexión?")) return;
    try {
      const res = await fetch(`http://localhost:3000/connections/${form.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessage(data.message || "Conexión eliminada");
      setEditing(false);
      setForm({ name: "", host: "", codLocal: "" });
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      setMessage("❌ Error al eliminar conexión");
    }
  };

  return (
    <div className="card p-4 shadow-sm">
      <h4 className="mb-3">Gestión de Conexiones</h4>

      <div className="mb-3">
        <label className="form-label fw-bold">Seleccionar conexión:</label>
        <select className="form-select" value={selected}
          onChange={(e) => {
            const id = e.target.value;
            setSelected(id);

            // 🧹 Limpia artículos cuando se cambia de conexión
            localStorage.setItem("connectedConnectionId", "");
            localStorage.setItem("connectedConnectionName", "");
            localStorage.setItem("connectionStatus", "PENDING");
            window.dispatchEvent(new Event("storage"));

            if (id) handleTestConnection(id);
          }}
        >
          <option value="">-- Selecciona una conexión --</option>
          {connections.map((c) => (
            <option key={c.id} value={c.id}>
              {c.codLocal ? `${c.codLocal} — ` : ""}
              {c.name} ({c.host})
            </option>
          ))}
        </select>
      </div>

      {message && (
        <div
          className={`alert mt-2 ${
            message.includes("OK")
              ? "alert-success"
              : message.includes("⏳")
              ? "alert-info"
              : "alert-warning"
          }`}
        >
          {message}
        </div>
      )}

      {connectedId && (
        <div className="mt-2">
          <small className="text-success">
            Conexión activa: ID {connectedId} —{" "}
            {localStorage.getItem("connectedConnectionName")}
          </small>
        </div>
      )}

      <hr />
      <h5>{editing ? "Editar conexión" : "Nueva conexión"}</h5>

      {/* 🆕 Formulario de Nueva Conexión */}
      <div className="border-top pt-3 mt-3">
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Nombre"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Host"
            value={form.host}
            onChange={(e) => setForm({ ...form, host: e.target.value })}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Cod Local"
            value={form.codLocal}
            onChange={(e) => checkCodLocal(e.target.value)}
          />

          {!editing ? (
            <button className="btn btn-success" onClick={addConnection}>
              +
            </button>
          ) : (
            <>
              <button className="btn btn-warning" onClick={updateConnection}>
                💾
              </button>
              <button className="btn btn-danger" onClick={deleteConnection}>
                🗑️
              </button>
            </>
          )}
        </div>
      </div>


      <hr />
      
    </div>
  );
}

export default ConnectionManager;
