import React, { useState } from "react";
import { API_BASE_URL } from "../../config"; // ajusta la ruta si aplica

function ZendeskTicketsView({onClose}) {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const buscar = async () => {
    if (!fechaInicio || !fechaFin) {
      setError("Debe seleccionar un rango de fechas");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setTickets([]);

      const response = await fetch(
        `${API_BASE_URL}/zendesk/tickets?desde=${fechaInicio}&hasta=${fechaFin}`
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status} consultando tickets`);
      }

      const data = await response.json();
      console.log(data[0]);
      
      setTickets(data);

      
    } catch (err) {
      console.error(err);
      setError("No fue posible obtener los tickets");
    } finally {
      setLoading(false);
    }

    
  };

  return (
    <div className="modal show d-block bg-dark bg-opacity-50">
        <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content">

            <div className="modal-header">
                <h4 className="m-0">📊 Reporte de Tickets Zendesk</h4>
                <button type="button" className="btn-close" onClick={() => onClose?.()}></button>
            </div>

            {/* FILTROS */}
            <div className="row mb-3 p-3">
                <div className="col-md-3">
                <label className="form-label">Desde</label>
                <input
                    type="date"
                    className="form-control"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                />
                </div>

                <div className="col-md-3">
                <label className="form-label">Hasta</label>
                <input
                    type="date"
                    className="form-control"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                />
                </div>

                <div className="col-md-3 d-flex align-items-end">
                <button
                    className="btn btn-primary w-100"
                    onClick={buscar}
                    disabled={loading}
                >
                    {loading ? "Consultando..." : "Buscar"}
                </button>
                </div>
            </div>

            {/* ERROR */}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* RESULTADOS */}
            <div className="table-responsive p-3" style={{ maxHeight: "400px" }}>
                <table className="table table-bordered table-sm">
                <thead className="table-light">
                    <tr>
                    <th>Fecha</th>
                    <th>Local</th>
                    <th>Tipo Consulta</th>
                    <th>Zonal</th>
                    <th>Incidencia</th>
                    <th>ID Ticket</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.length === 0 && !loading && (
                    <tr>
                        <td colSpan="6" className="text-center text-muted">
                        Sin resultados
                        </td>
                    </tr>
                    )}

                    {tickets.map((t) => (
                    <tr key={t.id_ticket}>
                        <td style={{ width: "110px", whiteSpace: "nowrap" }}>{new Date(t.created_at).toLocaleDateString()}</td>
                        <td>{t.fields[2].value}</td>
                        <td>{t.fields[5].value}</td>
                        <td>{t.fields[3].value}</td>
                        <td style={{ width: "110px", whiteSpace: "nowrap" }}>{t.fields[4].value}</td>
                        <td style={{ width: "110px", whiteSpace: "nowrap" }}>{t.encoded_id}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            
              </div>
        
      </div>
    </div>
  );
}

export default ZendeskTicketsView;
