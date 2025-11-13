// src/components/ReportsPanel.jsx
import React, { useEffect, useState, useCallback } from "react";
import { API_BASE_URL } from "../../config"; // ajusta si lo tienes centralizado

function ReportsPanel({ token }) {
  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 13); // últimos 14 días por defecto
    return d.toISOString().slice(0, 10);
  });

  const [dateTo, setDateTo] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });

  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ grouped: [] });
  const [message, setMessage] = useState("");

  // 🔹 useCallback para evitar warning de dependencia faltante
  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const qs = `?date_from=${dateFrom}&date_to=${dateTo}`;
      const res = await fetch(`${API_BASE_URL}/reports/incidence-by-day${qs}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!json.success) throw new Error();
      setData({ grouped: json.data });
      setMessage(""); // Limpia cualquier mensaje previo
    } catch (e) {
      setData({ grouped: [] });
      setMessage("No se pudo obtener el reporte.");
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo, token]); // dependencias correctas

  // 🔹 Llamada inicial y cuando cambian las fechas
  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const exportXlsx = async (type) => {
    try {
      const qs = `?type=${type}&date_from=${dateFrom}&date_to=${dateTo}`;
      const url = `${API_BASE_URL}/reports/export${qs}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al exportar");

      const blob = await res.blob();
      const href = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = `report_${type}_${dateFrom}_to_${dateTo}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(href);
    } catch {
      alert("Error al exportar");
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Reportes — Incidencias OFF</h5>
        <div>
          <button
            className="btn btn-sm btn-outline-secondary me-2"
            onClick={fetchReport}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Actualizar"}
          </button>
        </div>
      </div>

     <div className="card-body">
      <div className="row g-2 mb-3">
          <div className="col-auto">
            <label className="form-label small">Desde</label>
            <input
              type="date"
              className="form-control form-control-sm"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div className="col-auto">
            <label className="form-label small">Hasta</label>
            <input
              type="date"
              className="form-control form-control-sm"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
          <div className="col-auto">
            <label className="form-label small">Top</label>
            <input
              type="number"
              className="form-control form-control-sm"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              style={{ width: 80 }}
            />
          </div>
        </div>

        {message && <div className="alert alert-warning">{message}</div>}

        <div className="row">
          <div className="col-12 mb-3">
            <div className="card mb-3">
              <div className="card-header d-flex justify-content-between align-items-center">
                <strong>Desactivaciones agrupadas por día y local</strong>
                <button
                  className="btn btn-sm btn-outline-success"
                  onClick={() => exportXlsx("by_grouped")}
                >
                  Exportar Excel
                </button>
              </div>
              <div className="card-body p-2">
                <table className="table table-sm mb-0">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>CodLocal</th>
                      <th>Local</th>
                      <th>Artículos OFF</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.grouped?.map((r, idx) => (
                      <tr key={idx}>
                        <td>{new Date(r.fecha).toLocaleDateString()}</td>
                        <td>{r.codLocal}</td>
                        <td>{r.localName || "(sin nombre)"}</td>
                        <td>{r.articulos}</td>
                        <td className="text-end">{r.total_articulos}</td>
                      </tr>
                    ))}
                    {(!data.grouped || data.grouped.length === 0) && (
                      <tr>
                        <td colSpan="5" className="text-center text-muted">
                          Sin datos en el rango seleccionado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ReportsPanel;
