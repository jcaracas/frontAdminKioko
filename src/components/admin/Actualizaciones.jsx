import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";

function EstadoEquiposView() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargar = async () => {

    setLoading(true);

    try {

      const res = await fetch(`${API_BASE_URL}/actualizaciones/estado-equipos`);

      const d = await res.json();

      setData(d);

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    cargar();

    const intervalo = setInterval(cargar, 60000); // cada 1 min

    return () => clearInterval(intervalo);
  }, []);

  /*  CALCULAR ESTADO  */

  const calcularEstado = (fecha) => {
    const hoy = new Date();
    const f = new Date(fecha);

    // Normalizar a solo fecha (sin hora)
    const hoyDate = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const fDate = new Date(f.getFullYear(), f.getMonth(), f.getDate());

    const diffDias = Math.floor((hoyDate - fDate) / (1000 * 60 * 60 * 24));

    if (diffDias === 0) return "🟢 Actualizado";
    if (diffDias === 1) return "🟡 Reciente";
    return "🔴 Sin actualizar";
  };
  
  const formatFechaHora = (fecha) => {
    return new Date(fecha).toLocaleString("es-CL", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });
  };

  return (
    <div className="card p-3 shadow-sm">

      <h5 className="mb-3">Monitoreo de Equipos</h5>

      {loading && <div>Cargando...</div>}

      <div className="table-responsive">
        <table className="table table-sm table-bordered">
          <thead className="table-light">
            <tr>
              <th>Equipo</th>
              <th>Módulo</th>
              <th>Última actualización</th>
              <th>Estado</th>
              <th>IP</th>
            </tr>
          </thead>

          <tbody>
            {data.map((d, i) => (
            <tr key={i}>
                <td>{d.equipo}</td>
                <td>{d.modulo}</td>

                <td>
                {formatFechaHora(d.fecha)}
                </td>

                <td>
                {calcularEstado(d.fecha)}
                </td>

                <td>{d.ip}</td>
            </tr>
            ))}
        </tbody>

        </table>
      </div>

    </div>
  );
}

export default EstadoEquiposView;