import React, { useEffect, useState } from "react";

function LogsViewer({ token }) {
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/logs", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setLogs)
      .catch(() => setMessage("Error al cargar los logs"));
  }, [token]);

  return (
    <div className="card p-4">
      <h4 className="mb-3">Historial de Transacciones</h4>

      {message && <div className="alert alert-warning">{message}</div>}

      {logs.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Usuario</th>
              <th>Acción</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td>{log.username}</td>
                <td>{log.action}</td>
                <td>{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-muted">No hay registros recientes.</p>
      )}
    </div>
  );
}

export default LogsViewer;
