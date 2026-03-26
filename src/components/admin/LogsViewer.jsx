import React, { useEffect, useState, useCallback } from "react";
import { API_BASE_URL } from "../../config"; 

function LogsViewer({ token }) {
  const [logs, setLogs] = useState([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [localFilter, setLocalFilter] = useState("");
  const [message, setMessage] = useState("");
  

  // 1. Usamos useCallback para estabilizar loadLogs y depender de los filtros.
  const loadLogs = useCallback(async () => {
    try {
      let q = [];
      if (dateFrom) q.push(`date_from=${dateFrom}`);
      if (userFilter) q.push(`userFilter=${userFilter}`);
      if (localFilter) q.push(`localFilter=${localFilter}`);
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
  }, [token, dateFrom, dateTo, userFilter, localFilter]); // 2. Dependencias de useCallback

  // 3. useEffect ahora depende de loadLogs. Esto resolverá la advertencia
  // y, gracias a useCallback, recargará los datos cada vez que cambie un filtro.
  useEffect(() => { 
    loadLogs(); 
  }, [loadLogs]); 

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center gap-2">
        <h5 className="mb-0">Historial / Logs de Auditoría</h5>
        <div>
          <button className="btn btn-sm btn-outline-secondary m-0" onClick={loadLogs}>
            <i className="bi bi-arrow-clockwise"></i> <span className="d-none d-md-inline ms-1">Refrescar</span>
          </button>
        </div>
      </div>

      <div className="card-body">
        <div className="row g-2 mb-2 align-items-end ">
          <div className="d-flex flex-row col-md-4 gap-1 align-items-center m-0 mb-1">
            <label className="form-label small text-muted mb-0 " style={{ width: '20%' }}>Fecha:</label>
            <input type="date" className="form-control form-control-sm w-50" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </div>
          <div className="d-flex flex-row col-md-4 gap-1 align-items-center m-0 mb-1">
            <label className="form-label small text-muted mb-0 w-25">Usuario:</label>
            <input placeholder="Filtrar por usuario" className="form-control form-control-sm" value={userFilter} onChange={(e) => setUserFilter(e.target.value)} />
          </div>
          <div className="d-flex flex-row col-md-4 gap-1 align-items-center m-0">
            <label className="form-label small text-muted mb-0 w-25">Local:</label>
            <input placeholder="Filtrar por local" className="form-control form-control-sm" value={localFilter} onChange={(e) => setLocalFilter(e.target.value)} />
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
