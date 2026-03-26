import React from "react";
import { API_BASE_URL } from "../../config";
import MenuBadges from "./MenuBadges";
import MobileActions from "../utils/MobileActions";


const ArticlesTable = ({ articles, token, onUpdated,onEdit }) => {
  // 🛡️ Protección total
  if (!Array.isArray(articles)) {
    return <div className="alert alert-info">Cargando artículos...</div>;
  }

  if (articles.length === 0) {
    return <p>No hay artículos registrados</p>;
  }

  const toggleActivo = async (id, value) => {
    if (!window.confirm("¿Seguro de cambiar el estado del artículo?")) return;

    await fetch(`${API_BASE_URL}/articulos/${id}/estado`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ activo: value }),
    });

    onUpdated();
  };

  const deleteArticle = async (codigo) => {
    if (!window.confirm("¿Seguro de eliminar el artículo?")) return;

    await fetch(`${API_BASE_URL}/articulos/${codigo}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    onUpdated();
  };

  const exportarPDF = async (codigo) => {
    const res = await fetch(`${API_BASE_URL}/articulos/export/pdf/${codigo}`,{
      method: "GET",
      headers:{
        Authorization:`Bearer ${token}`
      }
    });

    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `articulo_${codigo}.pdf`;
    a.click();

  };

  const exportarExcel = async (codigo) => {
    try {
      const res = await fetch(`${API_BASE_URL}/articulos/export/excel/${codigo}`, {
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

  return (
    <table className="table table-bordered table-hover align-middle">
      <thead className="table-light">
        <tr className="text-center">
          <th title="SKU de articulo">Cód<span className="d-none d-md-inline ms-1">igo</span></th>
          <th title="Descripción" className="d-none d-md-table-cell">Descripción</th>
          <th title="Precio" className="d-none d-md-table-cell">Precio</th>
          <th title="Menús" className="d-none d-md-table-cell">Menús</th>
          <th title="Publicado">Publicado</th>
          <th title="Acciones">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {articles.length === 0 ? (
          <tr>
            <td colSpan="6" className="text-center">No hay artículos registrados</td>
          </tr>
        ) : (
          articles.map((article) => (
            <tr key={article.codigo}> {/* 👈 key correcto */}
              <td className="text-left"><span className="d-none d-md-table-cell">{article.codigo}</span>
                {/* Mobile: mostrar central como secundario */}
                  <div className="d-md-none text-muted small text-left" style={{ width: "150px" }}>
                    {article.codigo} - {article.precioA ? `$${Number(article.precioA).toLocaleString("es-CL", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    })}` : "Sin precio"} 
                    <br />
                    {article.descripcion} - 
                      <MenuBadges
                        a={article.disponibleA}
                        b={article.disponibleB}
                        c={article.disponibleC}
                      />
                  </div>
              </td>
              <td className="d-none d-md-table-cell">{article.descripcion}</td>
              <td className="d-none d-md-table-cell">${Number(article.precioA).toLocaleString("es-CL", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })}</td>
              <td className="d-none d-md-table-cell">
                <MenuBadges
                  a={article.disponibleA}
                  b={article.disponibleB}
                  c={article.disponibleC}
                />
              </td>
              <td>
                {new Date(article.fecha_inicio).toISOString().split("T")[0]} 
              </td>
              <td className="text-center">
                <div className="d-flex justify-content-center align-items-center">
                  {/* 🔹 DESKTOP */}
                  <div className="d-none d-md-flex gap-2">
                    <button title="Editar Artículo y Componentes" className="btn btn-sm btn-primary me-2" onClick={() => onEdit(article)} >
                      ✏️
                    </button>
                    <button title={article.activo ? "Desactivar Artículo" : "Activar Artículo"} 
                    className={`btn btn-sm ${ article.activo
                          ? "btn-success me-2"
                          : "btn-secondary me-2"
                      }`}
                      onClick={() => toggleActivo(article.id, !article.activo)}>
                      {article.activo ? "⏻" : "⏻"}
                    </button>
                    <button title="Exportar articulo y detalle en PDF" className="btn btn-sm btn-danger me-2" 
                      onClick={() => exportarPDF(article.codigo)}>
                      PDF
                    </button>
                    <button title="Exportar articulo y detalle en Excel" className="btn btn-sm btn-success me-2" 
                      onClick={() =>exportarExcel(article.codigo)}>
                      Xls
                    </button>
                    <button className="btn btn-sm btn-danger" title="Eliminar Articulo y Componentes" 
                    onClick={() => deleteArticle(article.codigo)}>
                      🗑️
                    </button>
                  </div>
                  {/* MOBILE */}
                  <MobileActions
                    actions={[
                      {
                        label: "Editar",
                        icon: "bi bi-pencil",
                        onClick: () => onEdit(article),
                      },
                      {
                        label: article.activo ? "Desactivar" : "Activar",
                        icon: article.activo ? "bi bi-toggle-on text-success" : "bi bi-toggle-off text-secondary",
                        onClick: () => toggleActivo(article.id, !article.activo),
                      },
                      {
                        label: "Exportar PDF",
                        icon: "bi bi-file-earmark-pdf text-danger",
                        onClick: () => exportarPDF(article.codigo),
                      },
                      {
                        label: "Exportar Excel",
                        icon: "bi bi-file-earmark-excel text-success",
                        onClick: () => exportarExcel(article.codigo),
                      },
                      {
                        label: "Eliminar",
                        icon: "bi bi-trash text-danger",
                        onClick: () => deleteArticle(article.codigo),
                      },
                    ]}
                  />
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default ArticlesTable;
