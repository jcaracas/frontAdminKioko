import React, {useState} from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


function MyNavbar({ user, onLogout }) {
  const navigate = useNavigate();
  const role = user?.role;

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const [expanded, setExpanded] = useState(false);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm position-relative"
      expanded={expanded} onToggle={() => setExpanded(!expanded)}>
      <Container fluid>

        <Navbar.Brand onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <img
            src="T.png"
            alt="Logo"
            style={{ height: "28px", marginRight: "8px" }}
          />
          Manager Crack
        </Navbar.Brand>

        {/* 🔥 HAMBURGUESA */}
        <Navbar.Toggle aria-controls="navbarNav" />

        {/* 🔥 CONTENIDO COLAPSABLE */}
        <Navbar.Collapse id="navbarNav">
          <Nav className="me-auto">

            {role !== "Comercial" && role !== "Zonal" && (
              <Nav.Link onClick={() => {navigate("/"); setExpanded(false); }}>
                Panel de Gestión
              </Nav.Link>
            )}

            {role === "Admin" && (
              <Nav.Link onClick={() => {navigate("/admin"); setExpanded(false); }}>
                Administración
              </Nav.Link>
            )}

            {(role === "Admin" || role === "Comercial" || role === "Zonal") && (
              <Nav.Link onClick={() => {navigate("/menu-locales"); setExpanded(false); }}>
                Menú Local
              </Nav.Link>
            )}

          </Nav>

          <div className="d-flex align-items-center gap-2">
            <span className="text-light">
              {user?.full_name} ({user?.role})
            </span>

            <Button variant="outline-light" size="sm" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </div>
        </Navbar.Collapse>

      </Container>
    </Navbar>
  );
}

export default MyNavbar;