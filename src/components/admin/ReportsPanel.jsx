// src/components/ReportsPanel.jsx
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config"; 

function ReportsPanel({ token }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/reports/daily?date=${date}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) setData(json.data);
      else setData(null);
    } catch (err) {
      setData(null);
    } finally { setLoading(false); }
  };

  useEffect(()=> { loadReport(); }, [date]);

  return (
    <div className="card p-3 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Reportes diarios</h5>
        <div>
          <input type="date" className="form-control" style={{display:"inline-block", width:180}} value={date} onChange={(e)=>setDate(e.target.value)} />
        </div>
      </div>

      {loading && <div className="alert alert-info">Cargando...</div>}

      {data ? (
        <>
          <h6>Acciones por usuario</h6>
          <table className="table table-sm">
            <thead><tr><th>Usuario</th><th>Acciones</th></tr></thead>
            <tbody>
              {data.stats.map(s => (
                <tr key={s.username}><td>{s.username}</td><td>{s.actions}</td></tr>
              ))}
            </tbody>
          </table>

          <h6 className="mt-3">Actividades recientes</h6>
          <div className="list-group" style={{maxHeight:300, overflow:"auto"}}>
            {data.recent.map(r => (
              <div key={r.id} className="list-group-item">
                <div className="small text-muted">{new Date(r.timestamp).toLocaleString()} — {r.username}</div>
                <div>{r.action}</div>
                <div className="small text-muted">{r.details}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-muted">Sin datos para la fecha seleccionada</div>
      )}
    </div>
  );
}

export default ReportsPanel;
