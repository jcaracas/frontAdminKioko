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

  async function extraerHtml() {
    const res = await fetch(`${API_BASE_URL}/zendesk/pedidosya/menu`);
    const json = await res.json();
    console.log(json);
  }
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
    <div className="container mt-4">
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
    <div className="row mb-3 justify-content-between">
        <div className="col-md-4">
            <input  type="text" className="form-control" placeholder="Buscar por local..."
                value={search} onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                }}
            />
        </div>

        <div className="col-md-2">
            <select className="form-select"  value={filterMenu}
                onChange={(e) => {
                    setFilterMenu(e.target.value);
                    setPage(1);
                }} >
                <option value="ALL">Todos</option>
                <option value="A">Menú A</option>
                <option value="B">Menú B</option>
                <option value="CRITICO">Crítico</option>
            </select>
        </div>

        <div className="col-md-2">
          <button className="btn btn-success"
            onClick={exportExcel} >
            <i className="bi bi-file-earmark-excel"></i>{" "}
            Exportar
          </button>
        </div>

        

        <div className="col-md-2">
          <button className="btn btn-primary" title="Agregar Menú origen a local"
            onClick={() => setShowModal(true)}
          > ➕ Agregar
          </button>
        </div>
    </div>

      {/* TABLA */}
    <table className="table table-striped">
        <thead>
          <tr className="table-secondary">
            <th>Local</th>
            <th>Menú Origen</th>
            <th>Crítico</th>
          </tr>
        </thead>
        <tbody>
            {paginatedLocales.map((l) => (
                <tr key={l.codLocal}>
                    <td>{l.local}</td>
                    <td>{l.menuOrigen || "—"}</td>
                    <td>
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
    <nav className="d-flex justify-content-center">
        <ul className="pagination">
            <li className={`page-item ${page === 1 && "disabled"}`}>
                <button className="page-link"
                    onClick={() => setPage(page - 1)} >
                    Anterior
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
                    Siguiente
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
