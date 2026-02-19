export default function ArticlesFilters({ filters, onChange, onCreate }) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h4 className="mb-0">Gestión de Artículos</h4>
      <div className="col-md-4">
        <input
          className="form-control"
          placeholder="Buscar por código o descripción"
          value={filters.search}
          onChange={(e) =>
            onChange({ ...filters, search: e.target.value })
          }
        />
      </div>

      

      <div className="col-md-3 ml-auto text-end">
        <button className="btn btn-primary" onClick={onCreate}>
          ➕ Nuevo Artículo
        </button>
      </div>
    </div>
  );
}
