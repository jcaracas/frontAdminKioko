// src/components/UsersManager.jsx
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config"; 

const ROLES = ["Admin","N1","N2"];

function UsersManager({ token }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);//verificar
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ username: "", password: "", full_name: "", email: "", role: "N2" });
  const [message, setMessage] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setUsers(data.data || []);
      else setMessage("Error cargando usuarios");
    } catch (err) {
      setMessage("Error de conexión");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ username: "", password: "", full_name: "", email: "", role: "N2" });
    setShowModal(true);
  };

  const openEdit = (u) => {
    setEditing(u.id);
    setForm({ username: u.username, password: "", full_name: u.full_name || "", email: u.email || "", role: u.role || "N2" });
    setShowModal(true);
  };

  const save = async (e) => {
    e?.preventDefault();
    try {
      const url = editing ? `${API_BASE_URL}/users/${editing}` : `${API_BASE_URL}/users`;
      const method = editing ? "PUT" : "POST";
      const body = { ...form };
      if (!editing && !form.password) return setMessage("Password requerido al crear usuario");
      if (editing && !form.password) delete body.password;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type":"application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!data.success) return setMessage(data.message || "Error");
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      setMessage("Error al guardar");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Eliminar usuario?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.success) return setMessage(data.message || "Error");
      fetchUsers();
    } catch (err) { setMessage("Error al eliminar"); }
  };

  return (
    <div className="card p-3 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Administración de Usuarios</h5>
        <div>
          <button className="btn btn-sm btn-success me-2" onClick={openCreate}>Nuevo usuario</button>
          <button className="btn btn-sm btn-outline-secondary" onClick={fetchUsers}>Actualizar</button>
        </div>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      <div className="table-responsive">
        <table className="table table-sm table-striped">
          <thead>
            <tr>
              <th>User</th><th>Nombre</th><th>Email</th><th>Role</th><th>Creado</th><th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.full_name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{new Date(u.created_at).toLocaleString()}</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEdit(u)}>Editar</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => remove(u.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={save}>
              <div className="modal-header">
                <h5 className="modal-title">{editing ? "Editar usuario" : "Nuevo usuario"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-2">
                  <label className="form-label">Usuario</label>
                  <input className="form-control" value={form.username} onChange={(e) => setForm({...form, username: e.target.value})} required />
                </div>
                <div className="mb-2">
                  <label className="form-label">{editing ? "Cambiar contraseña (opcional)" : "Contraseña"}</label>
                  <input type="password" className="form-control" value={form.password} onChange={(e)=> setForm({...form, password: e.target.value})} />
                </div>
                <div className="mb-2">
                  <label className="form-label">Nombre completo</label>
                  <input className="form-control" value={form.full_name} onChange={(e)=> setForm({...form, full_name: e.target.value})} />
                </div>
                <div className="mb-2">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={form.email} onChange={(e)=> setForm({...form, email: e.target.value})} />
                </div>
                <div className="mb-2">
                  <label className="form-label">Role</label>
                  <select className="form-select" value={form.role} onChange={(e)=> setForm({...form, role: e.target.value})}>
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{editing ? "Guardar cambios" : "Crear"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersManager;
