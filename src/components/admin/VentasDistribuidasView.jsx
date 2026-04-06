import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";

function VentasDistribuidasView({token}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/ventas/ventas-diarias`,  
        { method: "GET", headers: 
          { Authorization: `Bearer ${token} `}, 
        });
      const json = await res.json();
      
      setData(json);
    } catch (e) {
      console.error(e);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid mt-0 p-0">
      <h4 className="mb-3">📊 Conciliación Local vs Central</h4>

      <div style={{ maxHeight: 500, overflowY: "auto" }}>
        <table className="table table-bordered table-sm align-middle">
          
          <thead className="table-light">
            <tr>
              <th>Local</th>
              <th className="text-end">Local $</th>
              <th className="text-end d-none d-md-table-cell">Central $</th>
              <th className="text-end">Diferencia</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {data.map(l => (
              <tr key={l.codLocal}>

                {/* 🔹 LOCAL + CENTRAL EN MOBILE */}
                <td>
                  <div className="fw-semibold">{l.name}</div>

                  {/* Mobile: mostrar central como secundario */}
                  <div className="d-md-none text-muted small">
                    Central: ${l.central.total.toLocaleString("es-CL")}
                  </div>
                </td>

                {/* 🔹 LOCAL */}
                <td className="text-end">
                  ${l.local.total.toLocaleString("es-CL")}
                </td>

                {/* 🔹 CENTRAL SOLO DESKTOP */}
                <td className="text-end d-none d-md-table-cell">
                  ${l.central.total.toLocaleString("es-CL")}
                </td>

                {/* 🔹 DIFERENCIA */}
                <td className="text-end fw-bold">
                  ${l.diferencia.total.toLocaleString("es-CL")}
                </td>

                {/* 🔹 ESTADO */}
                <td>
                  {l.diferencia.total === 0 ? (
                    <span className="badge bg-success">OK</span>
                  ) : (
                    <span className="badge bg-danger">Diferencia</span>
                  )}
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {loading && (
        <div className="progress mb-2">
          <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: "100%" }} >
            Consultando servidor...
          </div>
        </div>
      )}
    </div>
  );
}

export default VentasDistribuidasView;
