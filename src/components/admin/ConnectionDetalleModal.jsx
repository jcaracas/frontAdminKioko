import React, { useEffect, useState } from "react";
import { Modal, Spinner, Badge } from "react-bootstrap";
import { API_BASE_URL } from "../../config";

function ConnectionDetalleModal({
  show,
  onHide,
  connectionId,
  token
}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  
  /* CARGAR */

  useEffect(() => {
    if (!show || !connectionId) return;
    cargar();
  }, [show, connectionId]);
  const cargar = async () => {
    setLoading(true);
    try {

      const res = await fetch(
        `${API_BASE_URL}/connections/detalle/${connectionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const json = await res.json();

      setData(json);

    } catch (error) {

      console.error(error);

    }

    setLoading(false);
  };

  /* HELPERS*/

  const formatFecha = (fecha) => {

    if (!fecha) return "-";

    return new Date(fecha).toLocaleString("es-CL", {

      year: "numeric",
      month: "2-digit",
      day: "2-digit",

      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const renderBoolean = (value) => {

    return value ? (

      <Badge bg="success">
        Sí
      </Badge>

    ) : (

      <Badge bg="secondary">
        No
      </Badge>
    );
  };

  /* RENDER */

  return (

    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
    >

      <Modal.Header closeButton className="p-2">

        <Modal.Title>
          Detalle Local
        </Modal.Title>

      </Modal.Header>

      <Modal.Body className="p-2">

        {loading && (

          <div className="text-center py-5">

            <Spinner animation="border" />

          </div>
        )}

        {!loading && data && (

          <div className="container-fluid p-1">

            <div className="row g-3">

              {/* INFORMACIÓN GENERAL */}

              <div className="col-12">

                <div className="card shadow-sm">

                  <div className="card-header fw-bold">
                    {data.name}
                  </div>

                  <div className="card-body p-2">

                    <div className="row">

                      <div className="col-12 col-md-4 mb-1">
                        <small className="text-muted">
                          Cód Local: <strong> {data.codLocal} </strong>
                        </small>

                      </div>

                      <div className="col-12 col-md-4 mb-1">
                        <small className="text-muted">
                          Host: <strong> {data.host} </strong>
                        </small>
                      </div>

                      <div className="col-12 col-md-4 mb-1">
                        <small className="text-muted">
                          Estado: <strong> {data.activo ? (
                            <Badge bg="success">
                              Activo
                            </Badge>
                          ) : (
                            <Badge bg="danger">
                              Inactivo
                            </Badge>
                          )} </strong>
                          
                        </small>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

              {/* =====================================================
                  EMPRESA
              ===================================================== */}

              <div className="col-md-6">

                <div className="card shadow-sm h-100">

                  <div className="card-header fw-bold">
                    Empresa: {data.razon_social || "-"}
                  </div>

                  <div className="card-body p-2">

                    <div className="mb-1">

                      <small className="text-muted">
                        RUT: {data.rut || "-"}
                      </small>

                    </div>

                  </div>

                </div>

              </div>

              {/* =====================================================
                  ZONAL
              ===================================================== */}

              <div className="col-md-6">

                <div className="card shadow-sm h-100">

                  <div className="card-header fw-bold">
                    Zonal: {data.zonal_nombre || "-"}
                  </div>

                  <div className="card-body p-2">
                    <div className="mb-1">
                      <small className="text-muted">
                        Email:  {data.zonal_email || "-"}
                      </small>

                    </div>

                  </div>

                </div>

              </div>

              {/* COMPONENTES */}

              <div className="col-12">

                <div className="card shadow-sm">

                  <div className="card-header fw-bold">
                    Equipamiento
                  </div>

                  <div className="card-body p-2">

                    <div className="table-responsive">

                      <table className="table table-sm">

                        <thead>

                          <tr>

                            <th>Componente</th>

                            <th>Activo</th>

                            <th>Cantidad</th>

                          </tr>

                        </thead>

                        <tbody>

                          <tr>

                            <td>Kiosko</td>

                            <td>{renderBoolean(data.kiosko)}</td>

                            <td>{data.ck || 0}</td>

                          </tr>

                          <tr>

                            <td>KDS</td>

                            <td>{renderBoolean(data.kds)}</td>

                            <td>{data.c_kds || 0}</td>

                          </tr>

                          <tr>

                            <td>Llamador</td>

                            <td>{renderBoolean(data.llamador)}</td>

                            <td>{data.c_llamador || 0}</td>

                          </tr>

                        </tbody>

                      </table>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

      </Modal.Body>

    </Modal>
  );
}

export default ConnectionDetalleModal;