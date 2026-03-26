import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";

const DIAS = [
  { id: 1, label: "Lunes" },
  { id: 2, label: "Martes" },
  { id: 3, label: "Miércoles" },
  { id: 4, label: "Jueves" },
  { id: 5, label: "Viernes" },
  { id: 6, label: "Sábado" },
  { id: 7, label: "Domingo" }
];

export default function HorarioBaseFormModal({ token, show, onClose, onSaved, localReemplazo = null  }) {
  const [locales, setLocales] = useState([]);
  const [selectedLocales, setSelectedLocales] = useState([]);
  const [dias, setDias] = useState([]);
  const [horaApertura, setHoraApertura] = useState("");
  const [horaCierre, setHoraCierre] = useState("");
  const [activo, setActivo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [cerrado, setCerrado] = useState(false);

  /* CARGA DE LOCALES */
  useEffect(() => {
    //if (!show) return;
    fetch(`${API_BASE_URL}/connections`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setLocales(data))
      .catch(err => console.error("Error cargando locales", err));
  }, [ token]);

  // 🔹 Si es reemplazo, fijar el local
  useEffect(() => {
    if (localReemplazo) {
      setSelectedLocales([localReemplazo.codlocal]);
    }
  }, [localReemplazo]);

  const toggleLocal = codlocal => {
    if (localReemplazo) return;

    setSelectedLocales(prev =>
      prev.includes(codlocal)
        ? prev.filter(l => l !== codlocal)
        : [...prev, codlocal]
    );
  };


  /* HANDLERS */
  const toggleDia = (dia) => {
    setDias(prev =>
      prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]
    );
  };

  /*const toggleLocal = (codLocal) => {
    setSelectedLocales(prev =>
      prev.includes(codLocal)
        ? prev.filter(l => l !== codLocal)
        : [...prev, codLocal]
    );
  };*/

  const toggleAllLocales = () => {
    if (selectedLocales.length === locales.length) {
      setSelectedLocales([]);
    } else {
      setSelectedLocales(locales.map(l => l.codLocal));
    }
  };

  /* GUARDAR */
  const handleSubmit = async () => {
    if (!dias.length || !selectedLocales.length) {
      alert("Debe seleccionar días y locales");
      return;
    }
    if (cerrado === false) {
      if (!horaApertura || !horaCierre || horaApertura >= horaCierre) {
        alert("Debe ingresar horas válidas");
        return;
      }
    }

    if (!localReemplazo && !selectedLocales.length) {
      alert("Debe seleccionar al menos un local");
      return;
    }

    setLoading(true);

    try {
      if (localReemplazo) {
         
        // 🔁 REEMPLAZO
        await fetch(
          `${API_BASE_URL}/horarios-base/replace/${localReemplazo.codlocal}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              dias,
              hora_apertura: horaApertura,
              hora_cierre: horaCierre,
              activo,
              cerrado
            })
          }
        );
      } else {
        // ➕ CREACIÓN NORMAL
        await fetch(`${API_BASE_URL}/horarios-base/bulk`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            locales: selectedLocales,
            dias,
            hora_apertura: horaApertura,
            hora_cierre: horaCierre,
            activo,
            cerrado
          })
        });
      }

      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error guardando horarios");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     RENDER
  ========================== */
  return (
    <div className="modal show d-block bg-dark bg-opacity-50">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">
                {localReemplazo
                ? `🔁 Reemplazar Horario Base – ${localReemplazo.local_nombre}`
                : "➕ Nuevo Horario Base"}
              </h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">

              {/* DÍAS */}
              <div className="mb-2">
                <label className="form-label fw-bold">Días de la Semana</label>
                <div className="d-flex flex-wrap gap-2">
                  {DIAS.map(d => (
                    <button
                      key={d.id}
                      className={`btn btn-sm ${
                        dias.includes(d.id) ? "btn-primary" : "btn-outline-secondary"
                      }`}
                      onClick={() => toggleDia(d.id)}
                    >
                      {d.label}
                    </button>
                  ))}
                  <div className="form-check  m-auto col">
                    <input type="checkbox" className="form-check-input" checked={cerrado} 
                      onChange={e => setCerrado(e.target.checked)}
                    />
                    <label className="form-check-label">Local Cerrado</label>
                  </div>
                </div>
              </div>

              {/* HORAS */}
              {!cerrado && (
                <div className="row mb-2">
                  <div className="d-flex justify-content-start gap-3 mb-2 align-items-center">
                    <label className="form-label mb-0">Hora Apertura: </label>
                    <input type="time" className="form-control w-25" value={horaApertura}
                      onChange={e => setHoraApertura(e.target.value)} />
                    <label className="form-label mb-0">Hora Cierre: </label>
                    <input type="time" className="form-control w-25" value={horaCierre}
                      onChange={e => setHoraCierre(e.target.value)} />
                  </div>
                </div>
              )}

              {/* LOCALES */}
              <div className="mb-3">
                <label className="form-label fw-bold">Locales</label>

                <div className="form-check mb-2">
                  <input className="form-check-input" type="checkbox" checked={selectedLocales.length === locales.length}
                    onChange={toggleAllLocales} disabled={!!localReemplazo}/>
                  <label className="form-check-label fw-bold"> Seleccionar Todos </label>
                </div>

                <div className="border rounded p-2" style={{ maxHeight: 200, overflowY: "auto" }}>
                  {locales.map(local => (
                    <div className="form-check" key={local.codLocal}>
                      <input className="form-check-input" type="checkbox"
                        checked={selectedLocales.includes(local.codLocal)} 
                        disabled={!!localReemplazo}
                        onChange={() => toggleLocal(local.codLocal)} />
                      <label className="form-check-label">
                        {local.name ?? `Local ${local.codLocal}`}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                disabled={loading}
                onClick={handleSubmit}
              >
                Guardar
              </button>
            </div>

          </div>
        </div>
      
    </div>
  );
}
