import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";

export default function MenuLocalModal({ show, onClose, onSuccess, token }) {
  const [locales, setLocales] = useState([]);
  const [form, setForm] = useState({
    codLocal: "",
    menuOrigen: "",
    menuCritico: false
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/menu-locales/locales-disponibles`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(setLocales)
      .catch(console.error);
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
    ...prev, [name]: type === "checkbox" ? checked : value
  }));
  };

  const handleSubmit = async () => {
    if (!form.codLocal || !form.menuOrigen) {
      alert("Debe seleccionar un local y menú origen");
      return;
    }

    const res = await fetch(`${API_BASE_URL}/menu-locales/agregar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Error creando menú");
      return;
    }

    onSuccess?.();

    // cerrar modal Bootstrap
    onClose();

    setForm({ codLocal: "", menuOrigen: "", menuCritico: false });
  };

  return (
    <div className="modal show d-block bg-dark bg-opacity-50">
      <div className="modal d-block">
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
                <h3 className="modal-title">Agregar Menú a Local</h3>
                <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">

                <div className="mb-1 d-flex flex-row gap-3 align-items-center">
                    <label className="form-label w-25 m-0">Local</label>
                    <select className="form-select" name="codLocal" value={form.codLocal} onChange={handleChange} >
                        <option value="">Seleccione un local</option>
                        {locales.map(l => (
                            <option key={l.codLocal} value={l.codLocal}>
                                {l.name} ({l.codLocal})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-1 d-flex flex-row gap-3 align-items-center">
                    <label className="form-label w-25 m-0">Menú Origen</label>
                    <select className="form-select" name="menuOrigen" value={form.menuOrigen}
                        onChange={handleChange} >|
                        <option value="ALL">Seleccione Menú</option>
                        <option value="A">Menú A</option>
                        <option value="B">Menú B</option>
                    </select>
                </div>

                <div className="mb-2 d-flex flex-row gap-3 align-items-center">
                    <label className="form-label mb-0">Menú Crítico</label>
                    <input type="checkbox" name="menuCritico" id="menuCritico" checked={form.menuCritico} onChange={handleChange} />                   
                </div>

                <div className="mb-1 d-flex flex-row gap-1 align-items-center">
                    <label className="form-label w-25 m-0">Pedya</label>
                    <input className="form-control" name="pedya" id="pedya" value ={form.pedya} onChange={handleChange} />                    
                    <label className="form-label w-25 m-0">Rappi</label>
                    <input className="form-control" name="rappi" id="rappi" value ={form.rappi} onChange={handleChange} />
                </div>

                <div className="mb-3 d-flex flex-row gap-1 align-items-center justify-content-start">
                    <label className="form-label w-25 m-0">Uber</label>
                    <input className="form-control" name="uber" id="uber" value ={form.uber} onChange={handleChange} />
                    
                </div>
                
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                    <button className="btn btn-primary" onClick={handleSubmit}> Guardar
                    </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
