import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";

export default function HorarioEspecialModal({ token, data, onClose, onSaved }) {

  const [form, setForm] = useState({
    codlocal: "",
    fecha: "",
    hora_apertura: "",
    hora_cierre: "",
    cerrado: false,
    motivo: ""
  });
  const [dato, setData] = useState(null);

  useEffect(() => {
  if (data) {
    setForm({
      codlocal: data.codlocal ?? "",
      fecha: "",
      hora_apertura: "",
      hora_cierre: "",
      cerrado: false,
      motivo: ""
    });
  }
}, [data]);
  

  const submit = async () => {
    await fetch(`${API_BASE_URL}/horarios-especiales`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    onSaved();
    onClose();
  };

  const fetchData = async () => {
    const res = await fetch(`${API_BASE_URL}/horarios-especiales/he/${data.codlocal}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setData(await res.json());
    
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="modal show d-block bg-dark bg-opacity-50">
      <div className="modal d-block">
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
              <h4>Horario Especial - {data.local_nombre}</h4>
              <button className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
                <div className="row mb-2">
                    <div className="col">
                        <input type="date" className="form-control mb-0" value={form.fecha} title="Seleccionar fecha"
                        onChange={e => setForm({ ...form, fecha: e.target.value })}
                        />
                    </div>
                    <div className="form-check m-auto col">
                        <input type="checkbox" className="form-check-input" checked={form.cerrado}
                        onChange={e => setForm({ ...form, cerrado: e.target.checked })}
                        />
                        <label className="form-check-label">Local cerrado</label>
                    </div>
                </div>
              

              {!form.cerrado && (
                <div className="row mb-2">
                    <div className="d-flex flex-row col align-items-center gap-2">
                        <label className="form-label mb-0">Apertura:</label>
                        <input type="time" className="form-control mb-0" value={form.hora_apertura}
                            onChange={e => setForm({ ...form, hora_apertura: e.target.value })}
                        />
                    </div>
                    <div className="d-flex flex-row col align-items-center gap-2">
                        <label className="form-label mb-0">Cierre:</label>
                        <input type="time" className="form-control mb-0" value={form.hora_cierre}
                            onChange={e => setForm({ ...form, hora_cierre: e.target.value })}
                        />
                    </div>
                </div>
              )}

              <input className="form-control" placeholder="Motivo" value={form.motivo || ""}
                onChange={e => setForm({ ...form, motivo: e.target.value })}
              />

            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={submit}>
                Guardar
              </button>
            </div>
            <div key={dato?.[0]?.codlocal} className="mb-2 p-3 pt-0">

                <table className="table table-sm">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Horario</th>
                            <th>Motivo</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {dato?.[0]?.especiales.map(h => (
                        <tr key={h.id}>
                        <td>{new Date(h.fecha).toISOString().split("T")[0]}</td>
                        <td>
                            {h.cerrado
                            ? "CERRADO"
                            : `${h.hora_apertura.slice(0,5)} - ${h.hora_cierre.slice(0,5)}`}
                        </td>
                        <td>{h.motivo}</td>
                        <td>
                            
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
