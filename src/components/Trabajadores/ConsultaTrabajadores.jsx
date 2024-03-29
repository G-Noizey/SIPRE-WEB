import React, { useEffect, useState } from "react";
import { Button, Container, Modal, Row, Form, Col } from "react-bootstrap";
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
  
  const [divisiones, setDivisiones] = useState([]); 
  const [divisionMap, setDivisionMap] = useState({});
  
  const [selectedDivisionSaldo, setSelectedDivisionSaldo] = useState("");

  const [saldoDisponible, setSaldoDisponible] = useState(0);

  


  const actualizarSaldoDivision = async (idDivision, nuevoSaldo) => {
    try {
      const response = await axios.put(`http://localhost:8080/division/${idDivision}/saldo`, null, { params: { newSaldo: nuevoSaldo } });
      return response.data;
    } catch (error) {
      console.error("Error al actualizar saldo de la división:", error);
      throw error;
    }
  };
  
  


  useEffect(() => {
    const fetchDivisiones = async () => {
      try {
        const response = await axios.get("http://localhost:8080/division/");
        setDivisiones(response.data.body);
        
        // Crear un mapa con el ID y el saldo de cada división
        const divisionMap = {};
        response.data.body.forEach((division) => {
          divisionMap[division.id] = division.saldo;
        });
        setDivisionMap(divisionMap);
      } catch (error) {
        console.error("Error al obtener las divisiones:", error);
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


  
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    status: true,
    userWorker: "",
    saldo: 0,
    telefono: "",
    direccion: "",
    division: { id: "", name: "", saldo: 0 },
  });
  
  useEffect(() => {
    if (formData.division.id && divisionMap[formData.division.id]) {
      const saldoDisponible = divisionMap[formData.division.id];
      if (formData.saldo > saldoDisponible) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El saldo asignado al trabajador supera el saldo disponible en la división.',
          confirmButtonColor: "#2D7541",

        });
      } else {
        setSaldoDisponible(saldoDisponible);
      }
    } else {
      setSaldoDisponible(0);
    }
  }, [formData.division.id, formData.saldo, divisionMap]);


  
  const columns = React.useMemo(
    () => [
      {
        Header: "Nombre",
        accessor: "name",
      },
      {
        Header: "División",
        accessor: "division.name",
      },
      {
        Header: "Estatus",
        accessor: "status",
        Cell: ({ value }) => (value ? "Activo" : "Inactivo"),
      },
      {
        Header: "Acciones",
        Cell: ({ row }) => (
          <>
            <Button variant="success" size="sm" onClick={() => handleEditShow(row.original.id)}>
              <AiFillEdit />
            </Button>
            {' '}
            <Button variant="success" size="sm" onClick={() => handleViewMoreShow(row.original)}>
              Ver más
            </Button>
          </>
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

  
  const [showViewMore, setShowViewMore] = useState(false);
  const [viewMoreData, setViewMoreData] = useState(null);

  const handleAdd = async () => {
    try {
      // Validar que el saldo asignado no exceda el saldo disponible
      if (formData.saldo > saldoDisponible) {
        throw new Error("El saldo asignado no puede exceder el saldo disponible en la división.");
      }

      // Verificar si ya existe un trabajador con el mismo correo electrónico
      const emailExists = await axios.get(`http://localhost:8080/worker/email/${formData.email}`);
      if (emailExists.data) {
        throw new Error("Ya existe un trabajador con el mismo correo electrónico.");
      }

      // Verificar si ya existe un trabajador con el mismo nombre de usuario
      const userWorkerExists = await axios.get(`http://localhost:8080/worker/userWorker/${formData.userWorker}`);
      if (userWorkerExists.data) {
        throw new Error("Ya existe un trabajador con el mismo nombre de usuario.");
      }

      const data = {
        name: formData.name,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
        status: formData.status ? 1 : 0,
        userWorker: formData.userWorker,
        saldo: parseFloat(formData.saldo),
        telefono: parseInt(formData.telefono),
        direccion: formData.direccion,
        idDivision: parseInt(formData.division.id),
      };

      // Realizar la inserción del trabajador
      await axios.post("http://localhost:8080/worker/", data);

      // Restar el saldo asignado al trabajador del saldo disponible en la división
      const updatedSaldoDisponible = saldoDisponible - parseFloat(formData.saldo);
      setSaldoDisponible(updatedSaldoDisponible);

      // Actualizar el saldo de la división en el backend
      await actualizarSaldoDivision(formData.division.id, updatedSaldoDisponible);

      // Mostrar mensaje de éxito
      await Swal.fire({
        icon: "success",
        title: "Trabajador agregado",
        text: "El trabajador se agregó correctamente.",
        confirmButtonColor: "#2D7541",
      });

      // Recargar la página
      window.location.reload();
    } catch (error) {
      console.error("Error al agregar el trabajador:", error);

      // Mostrar alerta de error
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Ocurrió un error al agregar al trabajador. Por favor, inténtalo de nuevo.",
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
    const trabajador = response.data.body;

    // Obtener la división correspondiente al trabajador
    const divisionResponse = await axios.get(`http://localhost:8080/division/${trabajador.division.id}`);
    const division = divisionResponse.data.body;

    setSelectedTrabajador({ ...trabajador, divisionName: division.name });
    setEditTrabajadorId(id);
    setShowEdit(true);
  } catch (error) {
    console.error("Error al obtener el trabajador para editar:", error);
  }
};



const handleEditSave = async () => {
  try {
    const updatedTrabajador = {
      id: editTrabajadorId,
      name: selectedTrabajador.name,
      lastname: selectedTrabajador.lastname,
      email: selectedTrabajador.email,
      userWorker: selectedTrabajador.userWorker,
      saldo: selectedTrabajador.saldo,
      telefono: selectedTrabajador.telefono,
      direccion: selectedTrabajador.direccion,
      idDivision: parseInt(selectedTrabajador.idDivision),
      status: selectedTrabajador.status,
      password: selectedTrabajador.password,
    };

    // Obtener el trabajador actual
    const trabajadorActual = trabajadores.find(t => t.id === editTrabajadorId);

    // Actualizar el trabajador en la base de datos
    await axios.put(`http://localhost:8080/worker/`, updatedTrabajador);

    // Cambiar la división del trabajador
    await axios.put(`http://localhost:8080/worker/${editTrabajadorId}/division`, null, { params: { idNuevaDivision: selectedTrabajador.idDivision } });

    // Devolver el saldo a la división anterior
    const saldoDevuelto = parseFloat(trabajadorActual.saldo);
    const nuevoSaldoDivisionActual = divisionMap[trabajadorActual.division.id] + saldoDevuelto;
    await axios.put(`http://localhost:8080/division/${trabajadorActual.division.id}/saldo`, null, { params: { newSaldo: nuevoSaldoDivisionActual } });

    // Restar el saldo de la nueva división
    const nuevoSaldoDivisionNueva = divisionMap[selectedTrabajador.idDivision] - parseFloat(selectedTrabajador.saldo);
    await axios.put(`http://localhost:8080/division/${selectedTrabajador.idDivision}/saldo`, null, { params: { newSaldo: nuevoSaldoDivisionNueva } });

    // Mostrar mensaje de éxito
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






  
  const handleViewMoreShow = (data) => {
    setViewMoreData(data);
    setShowViewMore(true);
  };
  
  const handleViewMoreClose = () => {
    setShowViewMore(false);
    setViewMoreData(null);
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


       {/* Modal para agregar trabajador */}
<Modal show={show} onHide={handleClose}>
  <Modal.Header closeButton>
    <Modal.Title>Añadir Trabajador</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Container>
      <Row>
        <Col>
          <label>Nombre:</label>
          <Form.Control
            type="text"
            placeholder=""
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
        </Col>
        <Col>
          <label>Apellidos:</label>
          <Form.Control
            type="text"
            placeholder=""
            value={formData.lastname}
            onChange={(e) =>
              setFormData({ ...formData, lastname: e.target.value })
            }
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <label>Usuario:</label>
          <Form.Control
            type="text"
            placeholder=""
            value={formData.userWorker}
            onChange={(e) =>
              setFormData({ ...formData, userWorker: e.target.value })
            }
          />
        </Col>
        <Col>
          <label>Correo Electrónico:</label>
          <Form.Control
            type="text"
            placeholder=""
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <label>Contraseña:</label>
          <Form.Control
            type="text"
            placeholder=""
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </Col>
        <Col>
          <label>Telefono:</label>
          <Form.Control
            type="text"
            placeholder=""
            value={formData.telefono}
            onChange={(e) =>
              setFormData({ ...formData, telefono: e.target.value })
            }
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <label>Direccion:</label>
          <Form.Control
            type="text"
            placeholder=""
            value={formData.direccion}
            onChange={(e) =>
              setFormData({ ...formData, direccion: e.target.value })
            }
          />
        </Col>
        <Col>
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

              // Actualizar el saldo de la división seleccionada
              setSelectedDivisionSaldo(divisionMap[selectedDivisionId]);
            }}
          >
            <option value="">Selecciona una división</option>
            {divisiones.map((division) => (
              <option key={division.id} value={division.id}>
                {division.name}
              </option>
            ))}
          </Form.Control>
        </Col>
      </Row>


      <Row>

      <Col>
          <label>Saldo disponible de la división:</label>
          <p>{selectedDivisionSaldo}</p>
        </Col>
        <Col>
          <label>Saldo a asignar:</label>
          <Form.Control
            type="text"
            placeholder=""
            value={formData.saldo}
            onChange={(e) =>
              setFormData({ ...formData, saldo: e.target.value })
            }
          />
        </Col>
     
      </Row>

      
    </Container>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="success" onClick={handleAdd}>
      Crear
    </Button>
  </Modal.Footer>
</Modal>



{/* Modal para modificar trabajador */}


<Modal show={showEdit} onHide={handleEditClose}>
  <Modal.Header closeButton>
    <Modal.Title>Modificar Trabajador</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Container>
      <Row>
        <Col>
          <label>Nombre de el administrador:</label>
          <Form.Control
            type="text"
            placeholder=""
            value={selectedTrabajador?.name || ""}
            onChange={(e) =>
              setSelectedTrabajador({
                ...selectedTrabajador,
                name: e.target.value,
              })
            }
          />
        </Col>
        <Col>
          <label>Apellido:</label>
          <Form.Control
            type="text"
            placeholder=""
            value={selectedTrabajador?.lastname || ""}
            onChange={(e) =>
              setSelectedTrabajador({
                ...selectedTrabajador,
                lastname: e.target.value,
              })
            }
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <label>Correo Electrónico:</label>
          <Form.Control
            type="text"
            placeholder=""
            value={selectedTrabajador?.email || ""}
            onChange={(e) =>
              setSelectedTrabajador({
                ...selectedTrabajador,
                email: e.target.value,
              })
            }
          />
        </Col>
        <Col>
          <label>Usuario:</label>
          <Form.Control
            type="text"
            placeholder=""
            value={selectedTrabajador?.userWorker || ""}
            onChange={(e) =>
              setSelectedTrabajador({
                ...selectedTrabajador,
                userWorker: e.target.value,
              })
            }
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <label>Telefono:</label>
          <Form.Control
            type="text"
            placeholder=""
            value={selectedTrabajador?.telefono || ""}
            onChange={(e) =>
              setSelectedTrabajador({
                ...selectedTrabajador,
                telefono: e.target.value,
              })
            }
          />
        </Col>
        <Col>
          <label>Direccion:</label>
          <Form.Control
            type="text"
            placeholder=""
            value={selectedTrabajador?.direccion || ""}
            onChange={(e) =>
              setSelectedTrabajador({
                ...selectedTrabajador,
                direccion: e.target.value,
              })
            }
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <label>División Actual:</label>
          <Form.Control
            type="text"
            placeholder=""
            value={selectedTrabajador?.division?.name || ""}
            disabled
          />
        </Col>
        <Col>
          <label>Seleccionar Nueva División:</label>
          <Form.Control
            as="select"
            value={selectedTrabajador?.idDivision || ""}
            onChange={(e) => {
              setSelectedTrabajador({
                ...selectedTrabajador,
                idDivision: e.target.value,
              });
              // Actualizar el saldo de la división seleccionada
              setSelectedDivisionSaldo(divisionMap[e.target.value]);
            }}
          >
            <option value="">Selecciona una nueva división</option>
            {divisiones.map((division) => (
              <option key={division.id} value={division.id}>
                {division.name}
              </option>
            ))}
          </Form.Control>
        </Col>
      </Row>

      <Row>

      <Col>
          <label>Saldo disponible de la división:</label>
          <p>{selectedDivisionSaldo}</p>
        </Col>
        <Col>
          <label>Saldo asignado o nuevo saldo:</label>
          <Form.Control
            type="text"
            placeholder=""
            value={selectedTrabajador?.saldo || ""}
            onChange={(e) =>
              setSelectedTrabajador({
                ...selectedTrabajador,
                saldo: e.target.value,
              })
            }
          />
        </Col>
       
      </Row>

      <Row>
        <Col>
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
        </Col>
      </Row>
    </Container>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="success" onClick={handleEditSave}>
      Guardar cambios
    </Button>
  </Modal.Footer>
</Modal>



   



{/* Modal para ver mas informacion del trabajador */}

   <Modal show={showViewMore} onHide={handleViewMoreClose}>
  <Modal.Header closeButton>
    <Modal.Title>Datos completos del trabajador</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Container>
      <Row>
        <label>Nombre:</label>
        <p>{viewMoreData?.name}</p>
      </Row>
      <Row>
        <label>Apellido:</label>
        <p>{viewMoreData?.lastname}</p>
      </Row>
      <Row>
        <label>Email:</label>
        <p>{viewMoreData?.email}</p>
      </Row>
      <Row>
        <label>Usuario:</label>
        <p>{viewMoreData?.userWorker}</p>
      </Row>
      <Row>
        <label>Saldo:</label>
        <p>{viewMoreData?.saldo}</p>
      </Row>
      <Row>
        <label>Teléfono:</label>
        <p>{viewMoreData?.telefono}</p>
      </Row>
      <Row>
        <label>Dirección:</label>
        <p>{viewMoreData?.direccion}</p>
      </Row>
      <Row>
        <label>División:</label>
        <p>{viewMoreData?.division?.name}</p>
      </Row>
      <Row>
        <label>Estatus:</label>
        <p>{viewMoreData?.status ? 'Activo' : 'Inactivo'}</p>
      </Row>
    </Container>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleViewMoreClose}>
      Cerrar
    </Button>
  </Modal.Footer>
</Modal>

           

          {/* Tabla de Trabajadores*/}

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