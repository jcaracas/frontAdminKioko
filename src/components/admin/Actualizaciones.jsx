import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";

function EstadoEquiposView() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("todos");

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
  }, []);

  const formatFechaHora = (fecha) => {
    return new Date(fecha).toLocaleString("es-CL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case "actualizado":
        return <span className="badge bg-success">🟢 {estado}</span>;
      case "No Actualizado":
        return <span className="badge bg-danger">🔴 {estado}</span>;
      case "Sin Archivos":
        return <span className="badge bg-warning text-dark">🟡 {estado}</span>;
      case "Carpeta No Existe":
        return <span className="badge bg-info">🔵 {estado}</span>;
      default:
        return <span className="badge bg-secondary">{estado}</span>;
    }
  };

  const filtrarModulos = (modulos) => {
    if (filtroEstado === "todos") return modulos;
    return modulos.filter(m => m.estado === filtroEstado);
  };

  return (
    <div className="card shadow-sm">

      <div className="card-header d-flex justify-content-between align-items-center gap-2">
        <h5 className="mb-0" title="Monitoreo de Equipos">Monitoreo<span className="d-none d-md-inline">de Equipos</span></h5>
        <div className="d-flex align-items-center gap-2">
          <div className="w-50">{data.length} <span className="d-none d-md-inline">Equi</span>pos</div>
          <select className="form-select w-0 py-1" value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}  >
            <option value="todos">Todos</option>
            <option value="actualizado">Actualizado</option>
            <option value="No Actualizado">No Actualizado</option>
            <option value="Sin Archivos">Sin Archivos</option>
            <option value="Carpeta No Existe">Carpeta No Existe</option>
          </select>
          <button onClick={cargar} className="btn btn-sm btn-outline-secondary m-0"><i className="bi bi-arrow-clockwise"></i></button>
        </div>
      </div>

      {loading && <div>Cargando...</div>}

      {!loading && (
        <div style={{ maxHeight: 500, overflowY: "auto" }}>
          <table className="table table-hover table-sm mb-0" >
            <thead className="table-light">
              <tr>
                <th>Equipo</th>
                <th title="Utima Actualizacion">Módulo</th>
                <th className="d-none d-md-table-cell">Última Actualización</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {data.map((eq, i) => {

                const modulosFiltrados = filtrarModulos(eq.modulos);

                if (modulosFiltrados.length === 0) return null;

                return modulosFiltrados.map((m, j) => (
                  <tr key={`${i}-${j}`}>
                    
                    {/* 🔥 SOLO SE RENDERIZA UNA VEZ */}
                    {j === 0 && (
                      <td rowSpan={modulosFiltrados.length} className="align-middle fw-bold">
                        {eq.equipo}
                      </td>
                    )}

                    <td>{m.modulo}
                      <div className="d-md-none text-muted small text-left" style={{ width: "150px" }}>
                        {formatFechaHora(m.fecha)} <br />
                      </div>
                    </td>
                    <td className="d-none d-md-table-cell">{formatFechaHora(m.fecha)}</td>
                    <td>{getEstadoBadge(m.estado)}</td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default EstadoEquiposView;