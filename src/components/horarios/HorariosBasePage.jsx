import { useEffect, useState, useCallback } from "react";
import HorarioBaseFormModal from "./HorarioBaseFormModal";
import HorarioEspecialModal from "./HorarioEspecialModal";
import ZendeskTicketsView from "./ZendeskTicketsView";
import Pagination from "../common/Pagination";
import { API_BASE_URL } from "../../config";

export default function HorariosBasePage({ token }) {
  const [horarios, setHorarios] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingHorario, setEditingHorario] = useState(null);
  const [showEspecialModal, setShowEspecialModal] = useState(false);
  const [horarioEspecial, setHorarioEspecial] = useState(null);
  const [searchLocal, setSearchLocal] = useState("");
  const [tickets, setTickets] = useState([]);
  const [showTicketsModal, setShowTicketsModal] = useState(false);
  
  const formatHora = (hora) => hora?.slice(0, 5);

  const limit = 10;

  /* ===============================
     Cargar horarios base (AGRUPADOS)
  =============================== */
  const fetchHorarios = useCallback(async () => {
    try {
      const params = new URLSearchParams({ page, limit });

      if (searchLocal.trim()) {
            params.append("search", searchLocal.trim());
        }
    
      const res = await fetch(`${API_BASE_URL}/horarios-base?${params}`, {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!res.ok) {
        console.error("❌ Error cargando horarios base");
        return;
      }

      const data = await res.json();
      
      setHorarios(Array.isArray(data.items) ? data.items : []);
      setTotal(data.total || 0);
      

    } catch (err) {
      console.error("❌ Error inesperado", err);
    }
  }, [page, searchLocal, token]);

  useEffect(() => {
    fetchHorarios();
  }, [fetchHorarios]);

  const exportarExcel = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/horarios-base/export/excel`,{
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error("Error exportando");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "horarios.xlsx";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("No se pudo exportar el Excel");
    }
  };

  /* ===============================
     Render
  =============================== */
  return (
    <div className="card p-4 shadow-sm">

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Horarios Base</h4>
        <div className="d-flex gap-2">
            <input type="text" className="form-control m-auto" placeholder="Buscar local..."
            value={searchLocal}
            onChange={(e) => {
                setSearchLocal(e.target.value);
                setPage(1); // reset página
            }}
            style={{ width: "220px" }}
            />

            <button className="btn btn-success" onClick={exportarExcel}>
              📊 Exportar Excel
            </button>


            <button className="btn btn-primary m-auto" onClick={() => {
                setEditingHorario(null);      // 👈 creación normal
                setShowModal(true);
              }}
            > ➕ Nuevo Horario 
            </button>
        </div>
        
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Local</th>
            <th>Días</th>
            <th>Apertura - Cierre</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {horarios.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                No hay horarios registrados
              </td>
            </tr>
          ) : (
            horarios.map((local) => (
              <tr key={local.codlocal}>
                <td><strong>{local.local_nombre}</strong></td>

                <td>
                  {local.horarios.map((h, i) => (
                    <div key={i}>
                      {h.dias}
                    </div>
                  ))}
                </td>

                <td>
                  {local.horarios.map((h, i) => (
                    <div key={i}>
                      {h.cerrado
                            ? "CERRADO"
                            : `${h.horario}`}
                    </div>
                  ))}
                </td>

                <td className="text-center">
                  <button className="btn btn-sm btn-outline-primary" title="Reemplazar Horario" onClick={() => {
                      setEditingHorario({
                        codlocal: local.codlocal,
                        local_nombre: local.local_nombre
                      });
                      setShowModal(true);
                    }}>🔁 
                  </button>

                  <button className="btn btn-sm btn-outline-warning ms-2" title="Asignar Horario Especial"
                    onClick={() => {
                      setHorarioEspecial({
                        codlocal: local.codlocal,
                        local_nombre: local.local_nombre
                      });
                      setShowEspecialModal(true);
                    }}
                  > ⏰
                  </button>
                  <button className="btn btn-sm btn-outline-secondary ms-2" title="Ver Tickets" onClick={() => {
                      setTickets({
                        codlocal: local.codlocal,
                        local_nombre: local.local_nombre
                      });
                      setShowTicketsModal(true);
                    }}>📊 
                  </button>
                </td>

              </tr>
            ))
          )}
        </tbody>

      </table>

      <Pagination
        page={page}
        total={total}
        limit={limit}
        onPageChange={setPage}
      />

      {showModal && (
        <HorarioBaseFormModal
          token={token}
          localReemplazo={editingHorario} // 👈 null = nuevo | objeto = reemplazo
          show={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingHorario(null);
          }}
          onSaved={fetchHorarios}
        />
      )}

      {showEspecialModal && (
        <HorarioEspecialModal
          token={token}
          data={horarioEspecial}
          onClose={() => setShowEspecialModal(false)}
          onSaved={fetchHorarios}
        />
      )}

      {showTicketsModal && (
        <ZendeskTicketsView
          token={token}
          data={tickets}
          onClose={() => setShowTicketsModal(false)}
        />
      )}
        
    </div>
  );
}
