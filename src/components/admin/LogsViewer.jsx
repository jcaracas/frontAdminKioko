import React, { useEffect, useState, useCallback } from "react";
import { API_BASE_URL } from "../../config"; 

function LogsViewer({ token }) {
  const [logs, setLogs] = useState([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [message, setMessage] = useState("");

  // 1. Usamos useCallback para estabilizar loadLogs y depender de los filtros.
  const loadLogs = useCallback(async () => {
    try {
      let q = [];
      if (dateFrom) q.push(`date_from=${dateFrom}`);
      if (dateTo) q.push(`date_to=${dateTo}`);
      if (userFilter) q.push(`user=${encodeURIComponent(userFilter)}`);
      const qs = q.length ? `?${q.join("&")}` : "";
      
      const maxRetries = 3;
      let res = null;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          res = await fetch(`${API_BASE_URL}/logs${qs}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.ok) break;

        } catch (err) {
          if (attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          } else {
            throw err; 
          }
        }
      }
      
      if (!res || !res.ok) {
        setMessage(`Error ${res ? res.status : 'desconocido'}: Fallo al cargar los registros después de ${maxRetries} intentos.`);
        setLogs([]);
        return;
      }
      
      const json = await res.json();
      if (json.success) {
        setLogs(json.data || []);
        setMessage("");
      } else {
        setMessage("Error al cargar logs: " + (json.error || "Datos inválidos."));
      }
    } catch (err) {
      setMessage("Error de conexión con el servidor.");
      setLogs([]);
    }
  }, [token, dateFrom, dateTo, userFilter]); // 2. Dependencias de useCallback

  // 3. useEffect ahora depende de loadLogs. Esto resolverá la advertencia
  // y, gracias a useCallback, recargará los datos cada vez que cambie un filtro.
  useEffect(() => { 
    loadLogs(); 
  }, [loadLogs]); 

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Historial / Logs de Auditoría</h5>
        <div>
          <button className="btn btn-sm btn-outline-secondary me-2" onClick={loadLogs}>
            <i className="bi bi-arrow-clockwise"></i> Refrescar
          </button>
        </div>
      </div>

      <div className="card-body">
        <div className="row g-2 mb-3 align-items-end">
          <div className="col-md-3">
            <label className="form-label small text-muted">Desde Fecha</label>
            <input type="date" className="form-control form-control-sm" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </div>
          <div className="col-md-3">
            <label className="form-label small text-muted">Hasta Fecha</label>
            <input type="date" className="form-control form-control-sm" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="form-label small text-muted">Usuario</label>
            <input placeholder="Filtrar por usuario" className="form-control form-control-sm" value={userFilter} onChange={(e) => setUserFilter(e.target.value)} />
          </div>
          <div className="col-md-2 d-grid">
            {/* El botón Filtrar ya no es tan necesario ya que el useEffect recarga
                automáticamente al cambiar los campos, pero lo mantenemos para recarga manual. */}
            <button className="btn btn-primary btn-sm" onClick={loadLogs}>
              <i className="bi bi-search"></i> Filtrar
            </button>
          </div>
        </div>

        {message && <div className="alert alert-warning small">{message}</div>}

        <div style={{ maxHeight: 500, overflowY: "auto" }}>
          <table className="table table-hover table-sm mb-0">
            <thead className="sticky-top bg-white shadow-sm">
              <tr className="table-secondary">
                <th style={{ width: '15%' }}>Fecha</th>
                <th style={{ width: '15%' }}>Usuario</th>
                <th style={{ width: '45%' }}>Detalle</th>
              </tr>
            </thead>
            <tbody>{logs.map(l => {
                const detalleMensaje = `Cambió el campo "${l.campo}" a "${l.valorNuevo}" del artículo "${l.articuloCodigo}" para el local "${l.codLocal}".`;
                
                const formattedDate = new Date(l.created_at).toLocaleString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                }).replace(',', '');

                return (
                  <tr key={l.id} className={l.requiereCorreccion ? 'table-warning' : ''}>
                    <td>{formattedDate}</td>
                    <td>{l.username}</td>
                    <td>{detalleMensaje}</td>
                  </tr>
                );
              })}{logs.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-3">
                    {message ? "No se pudieron cargar los registros." : "No hay registros de auditoría que coincidan con el filtro."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LogsViewer;
