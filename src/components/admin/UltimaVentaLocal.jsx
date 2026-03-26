import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";

function UltimaVentaLocal({ token }) {
  const [data, setData] = useState([]);
  const [dataOriginal, setDataOriginal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hora, setHora] = useState("");
  const [filtro, setFiltro] = useState("Estado");

  /* CONSULTAR BACKEND */

  const cargar = async () => {
    setLoading(true);
    setError("");

    try {
      const r = await fetch(`${API_BASE_URL}/ventas/estado-horario`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token} ` },
      });

      if (!r.ok) throw new Error("Error servidor");

      const d = await r.json();

      /* ordenar por prioridad */

      d.sort((a, b) => {
        const prioridad = {
          Critica: 1,
          "Demora leve": 2,
          "En horario": 3,
          "Sin ventas hoy": 4,
        };
        return prioridad[a.estado] - prioridad[b.estado];
      });

      setData(d);
      setDataOriginal(d);
    } catch (err) {
      console.error(err);

      setError("Error consultando estado");
    } finally {
      setLoading(false);
    }
  };

  /* AUTO REFRESH */

  useEffect(() => {
    cargar();

    const intervalo = setInterval(() => {
      cargar();
    }, 500000);

    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    if (filtro === "Estado") {
      setData(dataOriginal);
    } else {
      const filtrado = dataOriginal.filter(
        x => x.estado === filtro
      );
      setData(filtrado);
    }
  }, [filtro, dataOriginal]);

  /* COLOR ESTADO */
  const getBadge = (estado) => {
    if (estado === "En horario") return "badge bg-success";
    if (estado === "Demora leve") return "badge bg-warning";
    if (estado === "Sin ventas hoy") return "badge bg-secondary";
    return "badge bg-danger";
  };

  /* COLOR FILA */

  const getRowColor = (estado) => {
    if (estado === "Critica") return "#ffd6d6";
    if (estado === "Demora leve") return "#fff4cc";
    if (estado === "En horario") return "#e6ffe6";
    return "";
  };

  useEffect(() => {
    const actualizarHora = () => {
      const ahora = new Date();
      const horaChile = ahora.toLocaleString("es-CL", {
        timeZone: "America/Santiago",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      setHora(horaChile);
    };

    actualizarHora();
    const intervalo = setInterval(actualizarHora, 60000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="container-fluid mt-0 p-0">
      {/* HEADER */}

      <div className="d-flex justify-content-between mb-2 gap-2 align-items-center">
        <h3 className="m-0">Monitor <span className="d-none d-md-inline">de Ventas</span></h3>
        
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="form-select w-auto">
          <option value="Estado">Estado</option>
          <option value="En horario">En horario</option>
          <option value="Demora leve">Demora leve</option>
          <option value="Critica">Critica</option>
          <option value="Sin ventas hoy">Sin ventas hoy</option>
        </select>


        <button className="btn btn-primary" onClick={cargar} disabled={loading} title="Actualizar Ventas">
          🔄 <span className="d-none d-md-inline ms-1">Actualizar</span>
        </button>
        <div className="d-flex justify-content-center align-items-center ">
          <span className="d-none d-md-inline ms-1">HORA:</span>
          <input className="divhora" type="text" name="HoraActual" value={`${hora}`} readOnly
            style={{ width: "70px", textAlign: "center", border: "none", fontWeight: "bold"}}
          />
        </div>
      </div>

      {/* PROGRESO */}

      {loading && (
        <div className="progress mb-2">
          <div
            className="progress-bar progress-bar-striped progress-bar-animated"
            style={{ width: "100%" }}
          >
            Consultando servidor...
          </div>
        </div>
      )}

      {/* ERROR */}

      {error && <div className="alert alert-danger">{error}</div>}

      {/* TABLA */}

      <div className="table-responsive">
        <table className="table table-bordered table-sm">
          <thead className="table-dark">
            <tr className="text-center">
              <th><span className="d-none d-md-inline">Nombre </span>Local</th>
              <th className="d-none d-md-table-cell" style={{ width: 200 }}>Última Venta</th>
              <th style={{ width: 100 }}>Minutos</th>
              <th style={{ width: 150 }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && !loading && (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  Sin datos
                </td>
              </tr>
            )}

            {data.map((l) => (
              <tr key={l.codLocal} style={{ background: getRowColor(l.estado), }}>
                <td>{l.nombreLocal}</td>
                <td className="d-none d-md-table-cell">{l.ultimaFecha.replace("T", " ") ? l.ultimaFecha : "-"}</td>
                <td>{l.minutos ?? "-"}</td>
                <td className="text-center">
                  <span className={getBadge(l.estado)}>{l.estado}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UltimaVentaLocal;
