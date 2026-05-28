import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";
import MobileActions from "../utils/MobileActions";
import ConnectionDetalleModal from "./ConnectionDetalleModal";

function ConnectionsAdmin({ token }) {
  const emptyForm = {
    id: null,
    name: "",
    host: "",
    codLocal: "",
    kiosko: false,
    ck: "",
    kds: false,
    c_kds: "",
    llamador: false,
    c_llamador: "",
    activo: true
  };

  const [data, setData] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showDetalle, setShowDetalle] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  const cargar = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE_URL}/connections/paneladmin?search=${search}`,
        { headers }
      );

      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    cargar();
  }, []);

  const guardar = async () => {
    try {
      const method = form.id ? "PUT" : "POST";
      const url = form.id
        ? `${API_BASE_URL}/connections/${form.id}`
        : `${API_BASE_URL}/connections`;

      await fetch(url, {
        method,
        headers,
        body: JSON.stringify(form)
      });

      setForm(emptyForm);
      cargar();
    } catch (err) {
      console.error(err);
    }
  };

  const editar = (row) => setForm(row);

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar registro?")) return;

    await fetch(`${API_BASE_URL}/connections/${id}`, {
      method: "DELETE",
      headers
    });

    cargar();
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const toggleActivo = async (id, value) => {
      if (!window.confirm("¿Seguro de cambiar el estado del local?")) return;
  
      await fetch(`${API_BASE_URL}/connections/estado/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ activo: value }),
      });
  
      cargar();
    };

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Administrar Locales</h5>

        <div className="d-flex gap-2">
          <input className="form-control" placeholder="Buscar..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn btn-primary" onClick={cargar}>Buscar</button>
        </div>
      </div>

      <div className="card-body border-bottom">
        <div className="row g-2">

          <div className="col-md-3">
            <input className="form-control" name="name" placeholder="Nombre"
              value={form.name} onChange={onChange} />
          </div>

          <div className="col-md-3">
            <input className="form-control" name="host" placeholder="Host"
              value={form.host} onChange={onChange} />
          </div>

          <div className="col-md-2">
            <input className="form-control" name="codLocal" placeholder="CodLocal"
              value={form.codLocal} onChange={onChange} />
          </div>
          
          <div className="col-md-6 d-flex gap-3 align-items-center">
            <label><input type="checkbox" name="kiosko" checked={form.kiosko} onChange={onChange} />Kiosko</label>
            <input className="form-control" name="ck" placeholder="Cant. Kiosko"
            title="Cantidad de kioskos" value={form.ck} onChange={onChange}  disabled={!form.kiosko} />
            
            <label><input type="checkbox" name="kds" checked={form.kds} onChange={onChange} /> KDS</label>
            <input className="form-control" name="c_kds" placeholder="Cant. KDS" title="Cantidad de KDS"
              value={form.c_kds} onChange={onChange} disabled={!form.kds} />

            <label><input type="checkbox" name="llamador"
              checked={form.llamador} onChange={onChange} /> Llamador</label>
            <input className="form-control" name="c_llamador" title="IP del Llamador, solo ultimo octeto" placeholder="IP."
              value={form.c_llamador} onChange={onChange} disabled={!form.llamador} />
          </div>

          

          <div className="col-md-3 d-flex gap-2 justify-content-end m-auto">
            <button className="btn btn-success w-100" onClick={guardar}>
              {form.id ? "Actualizar" : "Crear"}
            </button>

            <button className="btn btn-secondary w-100"
              onClick={() => setForm(emptyForm)}>
              Limpiar
            </button>
          </div>

        </div>
      </div>

      <div className="table-responsive" style={{ maxHeight: 400, overflowY: "auto" }}>
        <table className="table table-sm table-hover mb-0">
          <thead className="table-light sticky-top">
            <tr>
              <th>Local</th>
              <th>Cod</th>
              <th>Host</th>
              <th>Kiosko</th>
              <th>KDS</th>
              <th>Llamador</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr><td colSpan="7">Cargando...</td></tr>
            )}

            {!loading && data.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>{row.codLocal}</td>
                <td>{row.host}</td>
                <td>{row.kiosko ? `✔ (${row.ck || 0})` : "-"}</td>
                <td>{row.kds ? `✔ (${row.c_kds || 0})` : "-"}</td>
                <td>{row.llamador ? `✔ (${row.c_llamador || 0})` : "-"}</td>
                <td className="text-center">
                    <div className="d-flex justify-content-center align-items-center">
                        <div className="d-none d-md-flex gap-2">

                            <button className="btn btn-sm btn-outline-primary" title="Ver Detalle" onClick={() => {
                                setSelectedId(row.id);
                                setShowDetalle(true);
                                }}
                              > 👁️
                              </button>

                            <button title="Editar local" className="btn btn-sm btn-primary" onClick={() => editar(row)} >
                                ✏️
                            </button>
                            <button title={row.activo ? "Desactivar Local" : "Activar Local"} 
                            className={`btn btn-sm ${ row.activo
                                ? "btn-success "
                                : "btn-secondary "
                            }`}
                            onClick={() => toggleActivo(row.id, !row.activo)}>
                                {row.activo ? "⏻" : "⏻"}
                            </button>
                            <button className="btn btn-sm btn-danger" title="Eliminar local"
                                onClick={() => eliminar(row.id)} >
                                🗑️
                            </button>
                        </div>
                        <MobileActions>
                            actions={[
                                {
                                label: "Editar",
                                icon: "bi bi-pencil",
                                onClick: () => editar(row),
                                },
                                {
                                label: row.activo ? "Desactivar" : "Activar",
                                icon: row.activo ? "bi bi-toggle-on text-success" : "bi bi-toggle-off text-secondary",
                                onClick: () => toggleActivo(row.id, !row.activo),
                                },
                                {
                                label: "Eliminar",
                                icon: "bi bi-trash text-danger",
                                onClick: () => eliminar(row.id),
                                },
                            ]}
                        </MobileActions>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {showDetalle && (
        <ConnectionDetalleModal
          show={showDetalle}
          onHide={() => setShowDetalle(false)}
          connectionId={selectedId}
          token={token}
        />
      )}

    </div>

  );

  
}

export default ConnectionsAdmin;