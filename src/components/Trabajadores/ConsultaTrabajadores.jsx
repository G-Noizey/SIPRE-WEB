import React, { useEffect, useState } from "react";
import { Button, Container, Modal, Row, Form } from "react-bootstrap";
import { AiFillEdit } from "react-icons/ai";
import { HiArrowSmRight, HiArrowSmLeft } from "react-icons/hi";
import { FaPlus } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTable, usePagination, useGlobalFilter } from "react-table";

import axios from "axios";
import Swal from "sweetalert2";

const ConsultaTrabajadores = () => {
  const [trabajadores, setTrabajadores] = useState([]);
  const [editTrabajadorId, setEditTrabajadorId] = useState(null);
  const [selectedTrabajador, setSelectedTrabajador] = useState(null);
  const [divisiones, setDivisiones] = useState([]); // Agregar este estado
  const [divisionMap, setDivisionMap] = useState({});
  
  useEffect(() => {
    const fetchDivisiones = async () => {
      try {
        const response = await axios.get('http://localhost:8080/division/');
        setDivisiones(response.data.body);
        
        // Crear un mapa de divisiones para asociar nombres con IDs
        const map = {};
        response.data.body.forEach(division => {
          map[division.name] = division.id;
        });
        setDivisionMap(map);
      } catch (error) {
        console.error('Error al obtener las divisiones:', error);
      }
    };
  
    fetchDivisiones();
  }, []);



  useEffect(() => {
    const fetchTrabajadores = async () => {
      try {
        const response = await axios.get("http://localhost:8080/worker/");
        setTrabajadores(response.data.body);
      } catch (error) {
        console.error("Error al obtener los trabajadores:", error);
      }
    };

    fetchTrabajadores();
   
  }, []);

  // Resto del código del componente...

// Manejar el cambio en el select del nombre de la división
  const handleDivisionChange = (selectedDivisionName) => {
    const selectedDivisionId = divisionMap[selectedDivisionName];
    setFormData({ ...formData, idDivision: selectedDivisionId });
  };
  
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    status: true,
    userWorker: "",
    saldo: "",
    telefono: "",
    direccion: "",
    division: { id: "", name: "" }, // Asegúrate de inicializar con un objeto vacío
  });
  

  const columns = React.useMemo(
    () => [
      {
        Header: "Nombre",
        accessor: "name",
      },
      {
        Header: "Apellido",
        accessor: "lastname",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Estatus",
        accessor: "status",
        Cell: ({ value }) => (value ? "Activo" : "Inactivo"),
      },
      {
        Header: "Usuario",
        accessor: "userWorker",
      },
      {
        Header: "Saldo",
        accessor: "saldo",
      },
      {
        Header: "Telefono",
        accessor: "telefono",
      },
      {
        Header: "Direccion",
        accessor: "direccion",
      },
      {
        Header: "Division",
        accessor: "division.name",
      },
      {
        Header: "Acciones",
        Cell: ({ row }) => (
          <Button
            variant="success"
            size="sm"
            onClick={() => {
              console.log("Edit ID:", row.original.id);
              handleEditShow(row.original.id);
            }}
          >
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
      data: trabajadores,
      initialState: { pageSize: 10 },
    },
    useGlobalFilter,
    usePagination
  );

  const { globalFilter, pageIndex } = state;

  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleAdd = async () => {
    try {
      const data = {
        name: formData.name,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
        status: formData.status ? 1 : 0, // Convertir a 1 si es true, 0 si es false
        userWorker: formData.userWorker,
        saldo: parseFloat(formData.saldo), // Convertir a número
        telefono: parseInt(formData.telefono), // Convertir a número entero
        direccion: formData.direccion,
        idDivision: parseInt(formData.division.id), // Convertir a número entero
      };
  
      await axios.post("http://localhost:8080/worker/", data);
  
      // Mostrar alerta de éxito
      await Swal.fire({
        icon: "success",
        title: "Trabajador agregado",
        text: "El trabajador se agregó correctamente.",
        confirmButtonColor: "#2D7541",
        didClose: () => {
          window.location.reload();
        },
      });
    } catch (error) {
      console.error("Error al agregar el trabajador:", error);
  
      // Mostrar alerta de error
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al agregar al trabajador. Por favor, inténtalo de nuevo.",
        confirmButtonColor: "#2D7541",
      });
    }
    setShow(false);
  };
  

  const handleEditClose = () => {
    setShowEdit(false);
    setEditTrabajadorId(null);
    setFormData({
      name: "",
      lastname: "",
      email: "",
      status: true,
      userWorker: "",
      saldo: "",
      telefono: "",
      direccion: "",
      division: { name: "" },
    });
  };

  const handleEditShow = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/worker/${id}`);
      setSelectedTrabajador(response.data.body);
      setEditTrabajadorId(id);
      setShowEdit(true);
    } catch (error) {
      console.error("Error al obtener el trabajador para editar:", error);
    }
  };

  const handleEditSave = async () => {
    try {
      await axios.put(
        `http://localhost:8080/worker/${editTrabajadorId}`,
        selectedTrabajador
      );

      await Swal.fire({
        icon: "success",
        title: "Trabajador modificado",
        text: "El trabajador se modificó correctamente.",
        confirmButtonColor: "#2D7541",
        didClose: () => {
          window.location.reload();
        },
      });
    } catch (error) {
      console.error("Error al modificar el trabajador:", error);
      // Mostrar alerta de error
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al modificar al trabajador. Por favor, inténtalo de nuevo.",
        confirmButtonColor: "#2D7541",
      });
    }
    setShowEdit(false);
  };

  return (
    <>
      <div className="container-fluid p-3 my-3">
        <div className="row">
          <div className="col-6">
            <Button variant="success" onClick={handleShow}>
              Añadir Trabajador <FaPlus />
            </Button>
          </div>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Añadir Trabajador</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container>
                <Row>
                  <label>Nombre:</label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </Row>
                <Row>
                  <label>Apellidos:</label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={formData.lastname}
                    onChange={(e) =>
                      setFormData({ ...formData, lastname: e.target.value })
                    }
                  />
                </Row>
                <Row>
                  <label>Usuario:</label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={formData.userWorker}
                    onChange={(e) =>
                      setFormData({ ...formData, userWorker: e.target.value })
                    }
                  />
                </Row>
                <Row>
                  <label>Correo Electrónico:</label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </Row>
                <Row>
                  <label>Contraseña:</label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </Row>
                <Row>
                  <label>Saldo:</label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={formData.saldo}
                    onChange={(e) =>
                      setFormData({ ...formData, saldo: e.target.value })
                    }
                  />
                </Row>
                <Row>
                  <label>Telefono:</label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={formData.telefono}
                    onChange={(e) =>
                      setFormData({ ...formData, telefono: e.target.value })
                    }
                  />
                </Row>
                <Row>
                  <label>Direccion:</label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={formData.direccion}
                    onChange={(e) =>
                      setFormData({ ...formData, direccion: e.target.value })
                    }
                  />
                </Row>
                <Row>
  <label>División:</label>
  <Form.Control
  as="select"
  value={formData.division.id}
  onChange={(e) => {
    const selectedDivisionId = e.target.value;
    const selectedDivisionName = divisiones.find(
      (division) => division.id === parseInt(selectedDivisionId)
    ).name;
    setFormData({
      ...formData,
      division: { id: selectedDivisionId, name: selectedDivisionName },
    });
  }}
>

    <option value="">Selecciona una división</option>
    {divisiones.map((division) => (
      <option key={division.id} value={division.id}>
        {division.name}
      </option>
    ))}
  </Form.Control>
</Row>


              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={handleAdd}>
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
                  <label>Nombre de el administrador:</label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={selectedTrabajador?.name || ""}
                    onChange={(e) =>
                      setTrabajadores({
                        ...selectedTrabajador,
                        name: e.target.value,
                      })
                    }
                  />
                </Row>
                <Row>
                  <label>Apellido:</label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={selectedTrabajador?.lastname || ""}
                    onChange={(e) =>
                      setTrabajadores({
                        ...selectedTrabajador,
                        lastname: e.target.value,
                      })
                    }
                  />
                </Row>
                <Row>
                  <label>Correo Electrónico:</label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={selectedTrabajador?.email || ""}
                    onChange={(e) =>
                      setTrabajadores({
                        ...selectedTrabajador,
                        email: e.target.value,
                      })
                    }
                  />
                </Row>
                <Row>
                  <label>Usuario:</label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={selectedTrabajador?.userWorker || ""}
                    onChange={(e) =>
                      setTrabajadores({
                        ...selectedTrabajador,
                        userWorker: e.target.value,
                      })
                    }
                  />
                </Row>
                <Row>
                  <label>Saldo:</label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={selectedTrabajador?.saldo || ""}
                    onChange={(e) =>
                      setTrabajadores({
                        ...selectedTrabajador,
                        saldo: e.target.value,
                      })
                    }
                  />
                </Row>
                <Row>
                  <label>Telefono:</label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={selectedTrabajador?.telefono || ""}
                    onChange={(e) =>
                      setTrabajadores({
                        ...selectedTrabajador,
                        telefono: e.target.value,
                      })
                    }
                  />
                </Row>
                <Row>
                  <label>Direccion:</label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={selectedTrabajador?.direccion || ""}
                    onChange={(e) =>
                      setTrabajadores({
                        ...selectedTrabajador,
                        direccion: e.target.value,
                      })
                    }
                  />
                </Row>
                <Row>
                  <label>ID Division:</label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={selectedTrabajador?.idDivision || ""}
                    onChange={(e) =>
                      setTrabajadores({
                        ...selectedTrabajador,
                        idDivision: e.target.value,
                      })
                    }
                  />
                </Row>
                <Row>
                  <label>Estatus:</label>
                  <Form.Control
                    as="select"
                    value={selectedTrabajador?.status ? "Activo" : "Inactivo"}
                    onChange={(e) =>
                      setSelectedTrabajador({
                        ...selectedTrabajador,
                        status: e.target.value === "Activo",
                      })
                    }
                  >
                    <option>Activo</option>
                    <option>Inactivo</option>
                  </Form.Control>
                </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={handleEditSave}>
                Guardar cambios
              </Button>
            </Modal.Footer>
          </Modal>

          <div className="col-6 d-flex justify-content-end">
            <input
              type="text"
              value={globalFilter || ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Buscar Trabajador..."
              style={{
                marginLeft: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
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
export default ConsultaTrabajadores;