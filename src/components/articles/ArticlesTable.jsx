import React from "react";
import { API_BASE_URL } from "../../config";
import MenuBadges from "./MenuBadges";


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

  return (
    <table className="table table-bordered table-hover">
      <thead className="table-light">
        <tr>
          <th>Código</th>
          <th>Descripción</th>
          <th>Precio</th>
          <th>Menús</th>
          <th>Publicado</th>
          <th>Acciones</th>
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
              <td>{article.codigo}</td>
              <td>{article.descripcion}</td>
              <td>${Number(article.precioA).toLocaleString("es-CL", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })}</td>
              <td>
                <MenuBadges
                  a={article.disponibleA}
                  b={article.disponibleB}
                  c={article.disponibleC}
                />
              </td>
              <td>
                {new Date(article.fecha_inicio).toISOString().split("T")[0]} / 
                {new Date(article.fecha_fin).toISOString().split("T")[0]}
              </td>
              <td>
                <button className="btn btn-sm btn-primary me-2" onClick={() => onEdit(article)} >
                  Editar
                </button>
                <button className={`btn btn-sm ${ article.activo
                      ? "btn-outline-danger"
                      : "btn-outline-success"
                  }`}
                  onClick={() => toggleActivo(article.id, !article.activo)}
                >
                  {article.activo ? "Desactivar" : "Activar"}
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default ArticlesTable;
