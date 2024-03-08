import React, { useState } from "react";
import { Button, Container, Modal, Row, Form } from "react-bootstrap";
import { AiFillEdit } from "react-icons/ai";
import { HiArrowSmRight, HiArrowSmLeft } from "react-icons/hi";
import { FaPlus } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTable, usePagination, useGlobalFilter } from "react-table";

const ConsultaAdministradores = () => {
  const data = React.useMemo(
    () => [
      {
        nombre: "Luis",
        apellido: "Perez",
        usuario: "wuichoperez",
        estatus: "Activo",
        correo: "admin1@sipre.company.mx"
      },


      {
        nombre: "Luis",
        apellido: "Perez",
        usuario: "wuichoperez",
        estatus: "Activo",
        correo: "admin1@sipre.company.mx"
      },

      {
        nombre: "Luis",
        apellido: "Perez",
        usuario: "wuichoperez",
        estatus: "Activo",
        correo: "admin1@sipre.company.mx"
      },

      {
        nombre: "Luis",
        apellido: "Perez",
        usuario: "wuichoperez",
        estatus: "Activo",
        correo: "admin1@sipre.company.mx"
      },

      {
        nombre: "Luis",
        apellido: "Perez",
        usuario: "wuichoperez",
        estatus: "Activo",
        correo: "admin1@sipre.company.mx"
      },

      {
        nombre: "Luis",
        apellido: "Perez",
        usuario: "wuichoperez",
        estatus: "Activo",
        correo: "admin1@sipre.company.mx"
      },

      {
        nombre: "Luis",
        apellido: "Perez",
        usuario: "wuichoperez",
        estatus: "Activo",
        correo: "admin1@sipre.company.mx"
      },

      {
        nombre: "Luis",
        apellido: "Perez",
        usuario: "wuichoperez",
        estatus: "Activo",
        correo: "admin1@sipre.company.mx"
      },

      {
        nombre: "Luis",
        apellido: "Perez",
        usuario: "wuichoperez",
        estatus: "Activo",
        correo: "admin1@sipre.company.mx"
      },

      {
        nombre: "Luis",
        apellido: "Perez",
        usuario: "wuichoperez",
        estatus: "Activo",
        correo: "admin1@sipre.company.mx"
      },


      {
        nombre: "Luis",
        apellido: "Perez",
        usuario: "wuichoperez",
        estatus: "Activo",
        correo: "admin1@sipre.company.mx"
      },

      {
        nombre: "Luis",
        apellido: "Perez",
        usuario: "wuichoperez",
        estatus: "Activo",
        correo: "admin1@sipre.company.mx"
      },
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Nombre",
        accessor: "nombre",
      },
      {
        Header: "Apellido",
        accessor: "apellido",
      },
      {
        Header: "Usuario",
        accessor: "usuario",
      },
      {
        Header: "Estatus",
        accessor: "estatus",
      },
      {
        Header: "Correo",
        accessor: "correo",
      },
      {
        Header: "Modificar",
        Cell: () => (
          <Button variant="success" size="sm" onClick={handleEditShow}>
            <AiFillEdit />
          </Button>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 10 },
    },
    useGlobalFilter,
    usePagination
  );

  const { globalFilter, pageIndex } = state;

  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleEditClose = () => setShowEdit(false);
  const handleEditShow = () => setShowEdit(true);

  const handleMoreClose = () => setShowMore(false);
  const handleMoreShow = () => setShowMore(true);

  return (
    <>
      <div className="container-fluid p-3 my-3">
        <div className="row">
          <div className="col-6">
            <Button variant="success" onClick={handleShow}>
              Añadir Administrador <FaPlus />
            </Button>
          </div>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Añadir Administrador</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container>
                <Row>
                  <label>Nombre:</label>
                  <Form.Control type="text" placeholder=" " />
                </Row>
                <Row>
                  <label>Apellidos:</label>
                  <Form.Control type="text" placeholder="" />
                </Row>
                <Row>
                  <label>Usuario:</label>
                  <Form.Control type="text" placeholder="" />
                </Row>
                <Row>
                  <label>Correo Electrónico:</label>
                  <Form.Control type="text" placeholder="" />
                </Row>
                <Row>
                  <label>Contraseña:</label>
                  <Form.Control type="password" placeholder="" />
                </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={handleClose}>
                Crear
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={showEdit} onHide={handleEditClose}>
            <Modal.Header closeButton>
              <Modal.Title>Modificar administrador</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container>
                <Row>
                  <label>Nombre:</label>
                  <Form.Control type="text" placeholder=" " />
                </Row>
                <Row>
                  <label>Apellidos:</label>
                  <Form.Control type="text" placeholder="" />
                </Row>
                <Row>
                  <label>Teléfono:</label>
                  <Form.Control type="text" placeholder="" />
                </Row>
                <Row>
                  <label>Dirección:</label>
                  <Form.Control type="text" placeholder="" />
                </Row>
                <Row>
                  <label>Correo Electrónico:</label>
                  <Form.Control type="text" placeholder="" />
                </Row>
                <Row>
                  <label>Contraseña:</label>
                  <Form.Control type="password" placeholder="" />
                </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={handleEditClose}>
                Actualizar
              </Button>
            </Modal.Footer>
          </Modal>


    

          <Modal show={showMore} onHide={handleMoreClose}>
            <Modal.Header closeButton>
              <Modal.Title>Detalles del Administrador</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container>
                <Row>
                  <label>Nombre:</label>
                  <span>For each</span>
                </Row>
                <Row>
                  <label>Apellidos:</label>
                  <span>For each </span>
                </Row>
                <Row>
                  <label>Usuario:</label>
                  <span>For each</span>
                </Row>
                <Row>
                  <label>Estatus:</label>
                  <span>For each </span>
                </Row>
                <Row>
                  <label>Correo Electrónico:</label>
                  <span>For each </span>
                </Row>
              </Container>
            </Modal.Body>
          </Modal>
          <div className="col-6 d-flex justify-content-end">
            <input
              type="text"
              value={globalFilter || ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Buscar Administrador"
              style={{ marginLeft: "10px", borderRadius: "5px", border: "1px solid #ccc"}}
            />
          </div>
        </div>
      </div>

      <div className="container-fluid p-3 my-3">
        <div className="row">
          <div className="col-12">
            <table
              {...getTableProps()}
              style={{
                borderCollapse: "collapse",
                width: "100%",
                marginTop: "20px",
              }}
            >
              <thead className="justify-content-center">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th className="text-center" {...column.getHeaderProps()}>
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="text-center" {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <React.Fragment key={row.id}>
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                          return (
                            <td {...cell.getCellProps()}>
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                      <tr key={`${row.id}-divider`}>
                        <td
                          colSpan={6}
                          style={{ borderBottom: "1px solid #ccc" }}
                        ></td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {pageOptions.length > 1 && (
            <div className="col-12 p-3 mt-3 d-flex justify-content-end">
              <Button
                variant="success"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                <HiArrowSmLeft />
              </Button>{" "}
              <Button
                variant="success"
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                <HiArrowSmRight />
              </Button>{" "}
              <span style={{ marginLeft: "10px" }}>
                Página{" "}
                <strong>
                  {pageIndex + 1} de {pageOptions.length}
                </strong>{" "}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ConsultaAdministradores;
