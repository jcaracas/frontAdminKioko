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
    <div className="card p-4 shadow-sm">
      <h4 className="mb-3">📊 Conciliación Ventas Local vs Central</h4>

      <div className="table-responsive">
        <table className="table table-bordered table-sm">
          <thead className="table-light">
            <tr>
              <th>Local</th>
              <th>Local $</th>
              <th>Central $</th>
              <th>Diferencia</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {data.map(l => (
              <tr key={l.codLocal}>
                <td>{l.name}</td>
                <td className="text-end">${l.local.total.toLocaleString("es-CL")}</td>
                <td className="text-end">${l.central.total.toLocaleString("es-CL")}</td>
                <td className="text-end fw-bold">
                  ${(l.diferencia.total).toLocaleString("es-CL")}
                </td>
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

      {loading && <small>Cargando conexiones...</small>}
    </div>
  );
}

export default VentasDistribuidasView;
