import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";

function AsignarZonalModal({ token, onClose, onSaved, dataUser }) {
  const [locales, setLocales] = useState([]);
  const [selectedLocales, setSelectedLocales] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =========================
     CARGA INICIAL
  ========================== */
  useEffect(() => {
    if (!token) return;
    cargarLocales();
  }, [token]);

  const cargarLocales = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE_URL}/connections/zonal/id/${dataUser}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();

      setLocales(data);

      // 🔑 preseleccionar asignados
      setSelectedLocales(
        data.filter(l => l.asignado).map(l => l.codLocal)
      );

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SELECCIÓN
  ========================== */
  const toggleLocal = codLocal => {
    setSelectedLocales(prev =>
      prev.includes(codLocal)
        ? prev.filter(l => l !== codLocal)
        : [...prev, codLocal]
    );
  };

  const toggleAllLocales = () => {
    if (selectedLocales.length === locales.length) {
      setSelectedLocales([]);
    } else {
      setSelectedLocales(locales.map(l => l.codLocal));
    }
  };

  /* =========================
     GUARDAR
  ========================== */
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE_URL}/connections/asignar-locales`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: dataUser,
            codLocales: selectedLocales,
          }),
        }
      );

      if (res.ok){
        alert("Locales asignados correctamente");
      }else{
        alert("Error asignando locales");
      }

      onSaved?.();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     DERIVADOS
  ========================== */
  const localesAsignados = locales.filter(l =>
    selectedLocales.includes(l.codLocal)
  );

  /* =========================
     RENDER
  ========================== */
  return (
    <div className="modal show d-block bg-dark bg-opacity-50">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Asignar locales al zonal</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">

            {/* CHECKBOXES */}
            <div className="mb-3">
              <label className="fw-bold">Locales</label>

              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={locales.length > 0 && selectedLocales.length === locales.length}
                  onChange={toggleAllLocales}
                />
                <label className="form-check-label fw-bold">
                  Seleccionar todos
                </label>
              </div>

              <div className="border rounded p-2" style={{ maxHeight: 200, overflowY: "auto" }}>
                {locales.map(local => (
                  <div className="form-check" key={local.codLocal}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={selectedLocales.includes(local.codLocal)}
                      onChange={() => toggleLocal(local.codLocal)}
                    />
                    <label className="form-check-label">
                      {local.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* RESUMEN */}
            <div className="mb-3">
              <label className="fw-bold">Locales asignados</label>
              <div className="form-control bg-light">
                {localesAsignados.length > 0
                  ? localesAsignados.map(l => l.name).join(", ")
                  : "Sin locales asignados"}
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

export default AsignarZonalModal;
