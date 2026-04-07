//import { API_BASE_URL } from "../../config";

export default function ArticlesFilters({ filters, onChange, onCreate, token }) {
  /*const exportarExcel = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/articulos/export/excel`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "articulos.xlsx";
      a.click();
    } catch (error) {
      console.error("Error exporting Excel:", error);
    }
  };

  const exportarPDF = async() => {
    try {
      const res = await fetch(`${API_BASE_URL}/articulos/export/pdf`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "articulos.pdf";
      a.click();
    } catch (error) {
      console.error("Error exporting PDF:", error);
    }
  };*/

  return (
    <div className="d-flex justify-content-start align-items-center mb-2 gap-3 flex-wrap">
      <h4 className="mb-0 letraMovil" title="Gestión de Productos"><span className="d-none d-md-inline ms-1">Gestión de</span> Productos</h4>
      <div className="col-md-4">
        <input className="form-control" placeholder="Buscar por código o descripción" value={filters.search}
          onChange={(e) =>
            onChange({ ...filters, search: e.target.value })
          } />
      </div>     

      <div className="col-md-3 ml-auto text-end">
        <button className="btn btn-primary" onClick={onCreate} title="Nuevo Producto">
          ➕ <span className="d-none d-md-inline ms-1">Nuevo Producto</span>
        </button>
      </div>
    </div>
  );
}
