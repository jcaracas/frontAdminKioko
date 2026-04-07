import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";

function EstadoEquiposView() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroEquipo, setFiltroEquipo] = useState("");

  // 🔥 Normalizar texto (búsqueda robusta)
  const normalizar = (txt) =>
    (txt || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

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

  // 🔥 Filtrar módulos por estado
  const filtrarModulos = (modulos) => {
    if (filtroEstado === "todos") return modulos;
    return modulos.filter(m => m.estado === filtroEstado);
  };

  // 🔥 FILTRO COMBINADO (equipo + estado)
  const dataFiltrada = data.filter((eq) => {

    const matchEquipo = normalizar(eq.equipo)
      .includes(normalizar(filtroEquipo));

    const matchEstado =
      filtroEstado === "todos"
        ? true
        : eq.modulos.some(m => m.estado === filtroEstado);

    return matchEquipo && matchEstado;
  });

  return (
    <div className="card shadow-sm">

      <div className="card-header d-flex justify-content-between align-items-center gap-2 flex-wrap">
        
        <h5 className="mb-0">
          Monitoreo de Equipos
        </h5>

        <div className="d-flex align-items-center gap-2">

          {/* 🔍 Buscar equipo */}
          <input  type="text" className="form-control py-1" placeholder="Buscar equipo..."
            value={filtroEquipo} onChange={(e) => setFiltroEquipo(e.target.value)} style={{ maxWidth: "150px" }} />

          {/* 🔢 contador */}
          <div className="w-75">{data.length} <span className="d-none d-md-inline">EQUI</span>POS</div>

          {/* 🎯 filtro estado */}
          <select className="form-select py-1" value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)} >
            <option value="todos">Todos</option>
            <option value="actualizado">Actualizado</option>
            <option value="No Actualizado">No Actualizado</option>
            <option value="Sin Archivos">Sin Archivos</option>
            <option value="Carpeta No Existe">Carpeta No Existe</option>
          </select>

          {/* 🔄 refresh */}
          <button
            onClick={cargar}
            className="btn btn-sm btn-outline-secondary"
          >
            <i className="bi bi-arrow-clockwise"></i>
          </button>

        </div>
      </div>

      {loading && <div className="p-3">Cargando...</div>}

      {!loading && (
        <div style={{ maxHeight: 500, overflowY: "auto" }}>
          <table className="table table-hover table-sm mb-0">
            
            <thead className="table-light">
              <tr>
                <th>Equipo</th>
                <th>Módulo</th>
                <th className="d-none d-md-table-cell">
                  Última Actualización
                </th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {dataFiltrada.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center">
                    Sin resultados
                  </td>
                </tr>
              )}

              {dataFiltrada.map((eq, i) => {

                const modulosFiltrados = filtrarModulos(eq.modulos);

                if (modulosFiltrados.length === 0) return null;

                return modulosFiltrados.map((m, j) => (
                  <tr key={`${i}-${j}`}>

                    {/* 👇 equipo solo una vez */}
                    {j === 0 && (
                      <td
                        rowSpan={modulosFiltrados.length}
                        className="align-middle fw-bold"
                      >
                        {eq.equipo}
                      </td>
                    )}

                    <td>
                      {m.modulo}
                      <div className="d-md-none text-muted small">
                        {formatFechaHora(m.fecha)}
                      </div>
                    </td>

                    <td className="d-none d-md-table-cell">
                      {formatFechaHora(m.fecha)}
                    </td>

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