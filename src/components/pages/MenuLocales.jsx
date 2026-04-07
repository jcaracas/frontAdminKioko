import { useEffect, useState, useCallback } from "react";
import { API_BASE_URL } from "../../config";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import MenuLocalModal from "./MenuLocalModal";

export default function MenuLocales({ token }) {
  const [locales, setLocales] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [filterMenu, setFilterMenu] = useState("ALL"); // ALL | A | B | CRITICO
  const [page, setPage] = useState(1);
  const pageSize = 20;

  
  // ===============================
  // FETCH DATA
  // ===============================
  const fetchLocales = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/menu-locales`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      
      if (Array.isArray(data)) {
        setLocales(data);
      } else {
        setLocales([]);
      }
    } catch (err) {
      console.error(err);
      setLocales([]);
    }
  }, [token]);

  useEffect(() => {
    fetchLocales();
  }, [fetchLocales]);

  // ===============================
  // AUTO CIERRE MENSAJE
  // ===============================
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 4000);
    return () => clearTimeout(t);
  }, [message]);

  // ===============================
  // UPDATE CRITICO
  // ===============================
  const toggleCritico = async (codLocal, value) => {
  // 👉 Confirmar SOLO si se marca como crítico
  if (value === true) {
    const ok = window.confirm(
      "⚠️ ¿Estás seguro de marcar este menú como CRÍTICO?\n\n" +
      "Esta acción puede generar impactos operacionales."
    );

    if (!ok) return; // ⛔ cancelado por el usuario
  }

  try {
    const res = await fetch(`${API_BASE_URL}/menu-locales/${codLocal}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ menuCritico: value }),
    });

    if (!res.ok) {
      throw new Error("Error al actualizar");
    }

    setMessage("OK: Estado actualizado");
    fetchLocales();

  } catch (err) {
    console.error(err);
    setMessage("Error actualizando estado");
  }
};


  // ===============================
  // FILTROS
  // ===============================
  const filteredLocales = locales.filter((l) => {
    const matchText =
      l.local?.toLowerCase().includes(search.toLowerCase());

    let matchMenu = true;

    if (filterMenu === "CRITICO") {
        matchMenu = l.menuCritico === true;
    }
    if (filterMenu === "A") {
        matchMenu = l.menuOrigen === "A" && !l.menuCritico;
    }
    if (filterMenu === "B") {
        matchMenu = l.menuOrigen === "B" && !l.menuCritico;
    }

    return matchText && matchMenu;
  });

  const totalPages = Math.ceil(filteredLocales.length / pageSize);

  const paginatedLocales = filteredLocales.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // ===============================
  // EXPORTAR EXCEL
  // ===============================
  const exportExcel = () => {
    const data = filteredLocales.map((l) => ({
      Local: l.local,
      "Menú Origen": l.menuOrigen || "",
      Crítico: l.menuCritico ? "SI" : "NO",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MenuLocales");

    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "menu_locales.xlsx");
  };

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="card mt-0 p-3 shadow-sm">
      <h3>Menú por Local</h3>

      {message && (
        <div className={`alert mt-2 ${
            message.includes("OK") ? "alert-success" : "alert-warning"
          }`}
        >
          {message}
        </div>
    )}

      {/* CONTROLES */}
    <div className="row mb-2 justify-content-between">
        <div className="col-md-4 mb-1">
            <input  type="text" className="form-control" placeholder="Buscar por local..."
                value={search} onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                }}
            />
        </div>

        <div className="d-flex gap-3 justify-content-star col-md-8 mb-1">
            <select className="form-select" style={{ width: "75%", maxWidth: "200px" }} value={filterMenu}
                onChange={(e) => {
                    setFilterMenu(e.target.value);
                    setPage(1);
                }} >
                <option value="ALL">Todos</option>
                <option value="A">Menú A</option>
                <option value="B">Menú B</option>
                <option value="CRITICO">Crítico</option>
            </select>
          <button className="btn btn-success" title="Exportar a Excel"
            onClick={exportExcel} >
            <i className="bi bi-file-earmark-excel"></i>{" "}
            <span className="d-none d-md-inline ms-1">Exportar</span>
          </button>
         <button className="btn btn-primary" title="Agregar Menú origen a local"
            onClick={() => setShowModal(true)}
          >➕<span className="d-none d-md-inline ms-1">Agregar</span>
          </button>
        </div>
    </div>
    <div style={{ maxHeight: 500, overflowY: "auto" }}>
      {/* TABLA */}
      <table className="table table-striped">
          <thead>
            <tr className="table-secondary">
              <th>Nombre Local</th>
              <th className="text-center">Menú Origen</th>
              <th className="text-center">Crítico</th>
            </tr>
          </thead>
          <tbody>
              {paginatedLocales.map((l) => (
                  <tr key={l.codLocal}>
                      <td>{l.local}</td>
                      <td className="text-center">{l.menuOrigen || "—"}</td>
                      <td className="text-center">
                          <input type="checkbox" checked={!!l.menuCritico}
                              onChange={(e) =>
                                  toggleCritico(l.codLocal, e.target.checked)
                              }
                          />
                      </td>
                  </tr>
              ))}
          </tbody>
      </table>
    </div>
    <nav className="d-flex justify-content-center">
        <ul className="pagination">
            <li className={`page-item ${page === 1 && "disabled"}`}>
                <button className="page-link"
                    onClick={() => setPage(page - 1)} >
                    Ant<span className="d-none d-md-inline ms-1">erior</span>
                </button>
            </li>

            {Array.from({ length: totalPages }).map((_, i) => (
            <li key={i} className={`page-item ${page === i + 1 && "active"}`}>
                <button className="page-link"
                    onClick={() => setPage(i + 1)} >
                    {i + 1}
                </button>
            </li>
            ))}

            <li className={`page-item ${page === totalPages && "disabled"}`}>
                <button className="page-link" onClick={() => setPage(page + 1)} >
                    Sig <span className="d-none d-md-inline ms-1">uiente</span>
                </button>
            </li>
        </ul>
    </nav>

    {showModal && (
      <MenuLocalModal
        show={showModal  }
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          setShowModal(false);
          fetchLocales();
        }}
        token={token}
      />
    )}

    </div>
  );
}
