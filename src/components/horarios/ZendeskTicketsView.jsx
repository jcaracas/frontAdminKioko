import React, { useState,useEffect } from "react";
import { API_BASE_URL } from "../../config"; // ajusta la ruta si aplica

function ZendeskTicketsView({token,dataLocal,onClose}) {
  // 🔥 Fecha por defecto = ayer
  const getYesterday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  };

  const [desde, setDesde] = useState(getYesterday());
  const [hasta, setHasta] = useState(getYesterday());
  const [codLocal, setCodLocal] = useState(dataLocal.codlocal);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  
  const cargar = async () => {
    setLoading(true);

    try {
      let url = `${API_BASE_URL}/zendesk/local/${codLocal}?desde=${desde}&hasta=${hasta}`;

      if (status) {
        url += `&status=${status}`;
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const d = await res.json();

      setData(d);

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const setUltimos7Dias = () => {
    const ahora = new Date();
    const semana = new Date();
    semana.setDate(ahora.getDate() - 7);

    setDesde(semana.toISOString().split("T")[0]);
    setHasta(ahora.toISOString().split("T")[0]);
  };

  // 🔥 Carga inicial
  useEffect(() => {
    cargar();
  }, [desde, hasta, status]);

  // 📅 Formato fecha
  const formatFecha = (f) => {
    if (!f) return "-";
    return new Date(f).toLocaleString("es-CL");
  };

  return (
    <div className="modal show d-block bg-dark bg-opacity-50">
        <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content">

            <div className="modal-header">
                <h5 className="mb-0">Tickets Zendesk por Local</h5>
                <button type="button" className="btn-close" onClick={() => onClose?.()}></button>
            </div>
            {/* 🔍 Filtros */}
            <div className="d-flex gap-2 mb-2 p-2 flex-wrap">
              <input className="form-control w-25" type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
              <input className="form-control w-25" type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />

              <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-select w-auto">
                <option value="">Todos</option>
                <option value="open">Abiertos</option>
                <option value="pending">Pendientes</option>
                <option value="closed">Cerrados</option>
              </select>

              <button className="btn btn-secondary" onClick={setUltimos7Dias}>Últimos 7 días</button>
              
            </div>

            {/* ⏳ Loading */}
            {loading && <div>Cargando...</div>}

            {/* 📊 Tabla */}
            <div className="table-responsive p-2">
              <table className="table table-sm table-bordered">

                <thead className="table-light">
                  <tr>
                    <th>Ticket</th>
                    <th>Estado</th>
                    <th>Tipo</th>
                    <th>Servicio</th>
                    <th>Consulta</th>
                    <th>Fecha Creación</th>
                    <th>Última Actualización</th>
                    <th>Completado</th>
                  </tr>
                </thead>

                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center">
                        Sin resultados
                      </td>
                    </tr>
                  ) : (
                    data.map((t) => (
                      <tr key={t.id}>
                        <td>{t.ticket_id}</td>
                        <td>{t.status}</td>
                        <td>{t.tipo_ticket || "-"}</td>
                        <td>{t.tipo_servicio || "-"}</td>
                        <td>{t.tipo_consulta || "-"}</td>
                        <td>{formatFecha(t.zd_created_at)}</td>
                        <td>{formatFecha(t.zd_updated_at)}</td>
                        <td>
                          {t.requerimiento_completado
                            ? <span className="badge bg-success">Sí</span>
                            : <span className="badge bg-secondary">No</span>}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
            </table>
          </div>          
        </div>
      </div>
    </div>
  );
}

export default ZendeskTicketsView;
