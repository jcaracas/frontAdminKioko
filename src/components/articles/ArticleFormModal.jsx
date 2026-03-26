import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config";

const emptyArticle = {
  codigo: "",
  descripcion: "",
  nombre:"",
  precioA: "",
  precioB: "",
  precioC: "",
  disponibleA: false,
  disponibleB: false,
  disponibleC: false,
  fecha_inicio: "",
  categoria: "",
  posicion: "",
  pya: false,
  uber: false,
  rappi: false
};
const CATEGORIAS = ["Seleccionar","Lo Nuevo","Super Promos","DFD","Basket","Compartit","Acompañantes","Bebidas","Postres"];



export default function ArticleFormModal({ article, token, onClose, onSaved }) {
  const isEdit = Boolean(article);
  const [form, setForm] = useState(article ? { ...article } : emptyArticle);
  const [saving, setSaving] = useState(false);
  const [articulos, setArticulos] = useState([]);
  const [selectedArticulos, setSelectedArticulos] = useState([]);
    

  useEffect(() => {
    if (!token) return;
    cargarArticulos();
  }, [token]);

const cargarArticulos = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/articulos/articuloServer`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setArticulos(data);           
    } catch (e) {
      console.error(e);
    } 
  };

  const getDetalle = async (codigo) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/articulos/detalle/${codigo}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      return data;
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  const cargarDetalle = async (codigo) => {
    const detalles = await getDetalle(codigo);
    
    setSelectedArticulos(detalles);
  };

  useEffect(() => {
    if (isEdit) {
      cargarDetalle(article.codigo);
    } else {
      setSelectedArticulos([]);
    } 
  }, [article]);

  const toggleArticulo = (art) => {
    const existe = selectedArticulos.some(a => a.codigo === art.codigo);
    if (existe) {
      // quitarlo
      setSelectedArticulos(
        selectedArticulos.filter(a => a.codigo !== art.codigo)
      );
    } else {
      // agregarlo
      setSelectedArticulos([
        ...selectedArticulos,
        {
          codigo: art.codigo,
          descrip: art.Descrip,
          base: false,
          cant: art.cant || 1
        }
      ]);
    }
  };

  const toggleBase = (codigo) => {
    setSelectedArticulos(prev =>
      prev.map(a =>
        a.codigo === codigo
          ? { ...a, base: !a.base }
          : a
      )
    );
  };

  const handleChangeCant = (codigo, value) => {
    setSelectedArticulos(prev =>
      prev.map(a =>
        a.codigo === codigo  ? { ...a, cant: value }
          : a
      )
    );
  };


  const componentes = selectedArticulos;
  
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);

    const url = isEdit
      ? `${API_BASE_URL}/articulos/${article.id}`
      : `${API_BASE_URL}/articulos`;

    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        articulos: selectedArticulos
      }),
    });

    setSaving(false);

    if (!res.ok) {
      alert("Error guardando artículo");
      return;
    }

    onSaved();
    onClose();
  };

  return (
    <div className="modal show d-block bg-dark bg-opacity-50">
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">
                {isEdit ? "Editar Artículo" : "Nuevo Artículo"}
              </h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              <div className="row g-ch-3">
                <div className="col-md-2 ">
                  <input className="form-control mb-2"name="codigo"value={form.codigo}
                    placeholder="Código" required title="Ingrese código del combo"
                    onChange={handleChange}/>
                </div>
                <div className="col-md-4">
                  <input className="form-control w-100 mb-2" name="nombre" value={form.nombre}
                    placeholder="Nombre" required title="Ingrese nombre del combo"
                    onChange={handleChange}/>
                </div>

                <div className="col-md-6">
                  <input className="form-control w-100 mb-2" name="descripcion"
                    value={form.descripcion} required placeholder="Descripción" title="Ingrese descripción del combo"
                    onChange={handleChange}/>
                </div>

                <div className="col-md-12 d-flex flex-row gap-2 mb-2">
                  <input type="text" className="form-control" name="precioA" placeholder="Precio Menú A"
                    value={form.precioA} required
                    onChange={handleChange}/>
                  <input type="text" className="form-control" name="precioB" placeholder="Precio Menú B"
                    value={form.precioB} onChange={handleChange}/>
                  <input type="text" className="form-control" name="precioC" placeholder="Precio Menú C"
                    value={form.precioC} onChange={handleChange}/>
                </div>
                <div className="col-md-6 d-flex flex-row gap-2 mb-2 align-items-center">
                  <div className="col-md-4 form-check">
                    <input type="checkbox" className="form-check-input" name="disponibleA"
                      checked={!!form.disponibleA} onChange={handleChange}/>
                    <label className="form-check-label">Menú A</label>
                  </div>

                  <div className="col-md-4 form-check">
                    <input type="checkbox" className="form-check-input" name="disponibleB"
                      checked={!!form.disponibleB} onChange={handleChange}/>
                    <label className="form-check-label">Menú B</label>
                  </div>

                  <div className="col-md-4 form-check">
                    <input type="checkbox" className="form-check-input" name="disponibleC"
                      checked={!!form.disponibleC} onChange={handleChange}/>
                    <label className="form-check-label">Menú C</label>
                  </div>
                  <div className="d-flex flex-row gap-3 mb-0 align-items-center">
                    <label>Publicación:</label>
                    <input type="date" className="form-control mb-0 w-50"name="fecha_inicio" required 
                    title="Ingrese fecha de publicación del combo"
                      value={
                        !!form.fecha_inicio
                          ? new Date(form.fecha_inicio)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-md-12 d-flex flex-row gap-2 mb-1">
                  <label className="fw-bold">Componentes del Combo</label>
                </div>
              </div>
              <div className="d-flex flex-row gap-4 mb-0 align-items-start">
                <div className="border rounded p-2" style={{ maxHeight: 200, overflowY: "auto", width: "40%" }}>
                  {articulos.map((art) => (
                    <div className="form-check" key={art.codigo}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selectedArticulos.some(
                          (a) => a.codigo === art.codigo,
                        )}
                        onChange={() => toggleArticulo(art)}
                      />
                      <label className="form-check-label">{art.Descrip}</label>
                    </div>
                  ))}
                </div>
                <div
                  className="d-flex flex-column gap-2 justify-content-left align-items-left"
                  style={{ width: "60%" }}
                >
                  <div className="d-flex flex-row mb-0 align-items-center gap-2">
                    <label className="form-label mb-0 w-50">Categoria:</label>
                    <select className="form-select w-100" required name="categoria"
                      value={!!form.categoria ? form.categoria : ""}
                      onChange={(e) =>
                        setForm({ ...form, categoria: e.target.value })
                      }
                    >
                      {CATEGORIAS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="d-flex flex-row mb-0 align-items-center gap-2">
                    <label className="form-label mb-0 w-50">Posición:</label>
                    <input type="number" className="form-control w-100" required name="posicion"
                      placeholder="Posición en el menú"
                      value={form.posicion}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="d-flex flex-row gap-2 mb-0 align-items-center">
                    <div className="col-md-4 form-check">
                      <input type="checkbox" className="form-check-input" name="pya"
                        checked={!!form.pya} onChange={handleChange}/>
                      <label className="form-check-label">Pedidos Ya</label>
                    </div>

                    <div className="col-md-4 form-check">
                      <input type="checkbox" className="form-check-input" name="uber"
                        checked={!!form.uber} onChange={handleChange}/>
                      <label className="form-check-label">Uber</label>
                    </div>

                    <div className="col-md-4 form-check">
                      <input type="checkbox" className="form-check-input" name="rappi"
                        checked={!!form.rappi} onChange={handleChange}/>
                      <label className="form-check-label">Rappi</label>
                    </div>
                  </div>
                  <div className="mb-0">
                    <div className="fw-bold d-flex flex-row gap-2 mb-1 align-items-center">
                      <label className="w-75">Componentes Agregados</label>
                      <label className="w-25 text-center">Base Fija</label>
                      <label className="w-25 text-center">Cant.</label>
                    </div>

                    <div className="form-control bg-light w-100"
                      style={{ height: 120, overflowY: "auto" }} >
                      {componentes.length > 0 ? (
                        componentes.map((c) => (
                          <div key={c.codigo} className="d-flex justify-content-between align-items-center border-bottom py-0"
                          >
                            <span className="w-75">{c.descrip}</span>

                            <div className="form-check w-25 align-items-center d-flex justify-content-center">
                              <input className="form-check-input" type="checkbox"
                                checked={c.base} onChange={() => toggleBase(c.codigo)} />

                            </div>
                            <div className="form-check w-25 p-0 d-flex justify-content-end align-items-center">
                              <input type="number" className="form-control my-2 text-center" title="Cantidad" step="1" min="1" style={{width:70, height:30}}
                                value={c.cant} onChange={(e) => handleChangeCant(c.codigo, e.target.value)} />
                            </div>
                          </div>
                        ))
                      ) : (
                        <span>Sin componentes</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer p-1">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>

              <button type="submit" className="btn btn-primary"disabled={saving}>
                {isEdit ? "Guardar cambios" : "Crear artículo"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
