import { useState } from "react";
import { API_BASE_URL } from "../../config";

const emptyArticle = {
  codigo: "",
  descripcion: "",
  activo: true,

  precioA: "",
  precioB: "",
  precioC: "",

  disponibleA: false,
  disponibleB: false,
  disponibleC: false,

  fecha_inicio: "",
  fecha_fin: "",
};

export default function ArticleFormModal({ article, token, onClose, onSaved }) {
  const isEdit = Boolean(article);

  const [form, setForm] = useState(article ? { ...article } : emptyArticle);
  const [saving, setSaving] = useState(false);

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
      body: JSON.stringify(form),
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
                  <input className="form-control mb-2" name="codigo" value={form.codigo} placeholder="Código" title="Ingrese código de articulo"
                  onChange={handleChange}  />
                </div>

                <div className="col-md-6">
                  <input className="form-control w-100 mb-2" name="descripcion" value={form.descripcion} placeholder="Descripción" title="Ingrese descripción del articulo"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-12 d-flex flex-row gap-2 mb-2">
                  <input type="number" className="form-control" name="precioA" placeholder="Precio Menú A"
                    value={form.precioA} onChange={handleChange}
                  />
                  <input type="number" className="form-control" name="precioB" placeholder="Precio Menú B"
                    value={form.precioB} onChange={handleChange}
                  />
                  <input type="number" className="form-control" name="precioC" placeholder="Precio Menú C"
                    value={form.precioC} onChange={handleChange}
                  />
                </div>
                <div className="col-md-12 d-flex flex-row gap-2 mb-2">
                  <div className="col-md-4 form-check">
                    <input type="checkbox" className="form-check-input" name="disponibleA"
                      checked={!!form.disponibleA} onChange={handleChange}
                    />
                    <label className="form-check-label">Menú A</label>
                  </div>

                  <div className="col-md-4 form-check">
                    <input type="checkbox" className="form-check-input" name="disponibleB"
                      checked={!!form.disponibleB} onChange={handleChange} />
                    <label className="form-check-label">Menú B</label>
                  </div>

                  <div className="col-md-4 form-check">
                    <input type="checkbox" className="form-check-input" name="disponibleC"
                      checked={!!form.disponibleC} onChange={handleChange} />
                    <label className="form-check-label">Menú C</label>
                  </div>
                </div>
                <div className="col-md-4">
                  <label>Inicio publicación</label>
                  <input type="date" className="form-control mb-2" name="fecha_inicio"
                    value={form.fecha_inicio || ""} onChange={handleChange} />
                </div>

                <div className="col-md-4">
                  <label>Fin publicación</label>
                  <input type="date" className="form-control mb-2" name="fecha_fin"
                    value={form.fecha_fin || ""} onChange={handleChange}
                  />
                </div>

                <div className="col-md-12 d-flex flex-row gap-2 mb-2">
                  <input type="checkbox" className="form-check-input" name="activo"
                    checked={!!form.activo} onChange={handleChange} />
                  <label className="form-check-label">Artículo activo</label>
                </div>

              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {isEdit ? "Guardar cambios" : "Crear artículo"}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
