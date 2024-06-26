import React, { useState, useEffect, useCallback } from "react";
import { Button, Container, Modal, Row, Form } from "react-bootstrap";
import { AiFillEdit } from "react-icons/ai";
import { HiArrowSmRight, HiArrowSmLeft } from "react-icons/hi";
import { FaPlus } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import axios from "axios";
import Swal from "sweetalert2";


//RUTA DE LA API
const apiUrl = import.meta.env.VITE_API_URL;


const ConsultaTransacciones = () => {
  const [trans, setTrans] = useState([]);
  
  const [divisiones, setDivisiones] = useState([]);

  const [divisionMap, setDivisionMap] = useState({});

  const [trabajadores, setTrabajadores] = useState([]);

  const [trabajadoresMap, setTrabajadoresMap] = useState({});

  const [selectedStatus, setSelectedStatus] = useState("");

     // Declaración del estado comentario
const [comentario, setComentario] = useState("");

// Memoizar la función setComentario con useCallback
const handleSetComentario = useCallback((e) => {
  setComentario(e.target.value);
}, []);

  const [updatedStatus, setUpdatedStatus] = useState("");

  const [tablaHabilitada, setTablaHabilitada] = useState(true);

  const [imagenUrl, setImagenUrl] = useState("");




  useEffect(() => {
    const fetchDivisiones = async () => {
      try {
        const response = await axios.get(`${apiUrl}/division/`);
        setDivisiones(response.data.body);
      } catch (error) {
        console.error("Error al obtener las divisiones:", error);
      }
    };

    fetchDivisiones();
  }, []);

  useEffect(() => {
    const fetchTrabajadores = async () => {
      try {
        const response = await axios.get(`${apiUrl}/worker/`);
        setTrabajadores(response.data.body);
      } catch (error) {
        console.error("Error al obtener los trabajadores:", error);
      }
    };

    fetchTrabajadores();
  }, []);

  useEffect(() => {
    const fetchTrans = async () => {
      try {
        const response = await axios.get(`${apiUrl}/transfer/`);
        setTrans(response.data.body);
      } catch (error) {
        console.error("Error al obtener las transfererencias:", error);
      }
    };

    fetchTrans();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "Trabajador",
        accessor: "beanWorkerTrans.name",
      },
      {
        Header: "División",
        accessor: "beanDivisionTrans.name",
      },
      {
        Header: "Monto",
        accessor: "monto",
      },
      {
        Header: "Estado",
        accessor: "status",
        Cell: ({ row }) => (
          <span className="badge" style={getCellStyle(row.original.status)}>
            {row.original.status}
          </span>
        ),
      },

      {
        Header: "Validar",
        Cell: ({ row }) => (
          <>
            <Button
              variant="warning"
              size="sm"
              onClick={() => handleViewMoreShow(row.original)}
              disabled={row.original.status === "Completado" || row.original.status === "Rechazado"}
              style={{
                backgroundColor: row.original.status === "Completado" || row.original.status === "Rechazado" ? "rgba(255, 0, 0, 0.5)" : undefined,
                pointerEvents: row.original.status === "Completado" || row.original.status === "Rechazado" ? "none" : "auto",
              }}
            >
              <AiFillEdit />
            </Button>
          </>
        ),
      },
      
    ],
    []
  );
  const handleUpdateTransfer = async (transferData) => {
    if (!transferData.beanWorkerTrans || !transferData.beanWorkerTrans.id) {
        console.error("El ID del trabajador es indefinido o nulo.");
        return;
    }

    const workerId = transferData.beanWorkerTrans.id;

    if (selectedStatus !== 'Completado' && selectedStatus !== 'Rechazado') {
        // Mostrar una alerta de SweetAlert
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El estado debe ser "Completado" o "Rechazado" para guardar los cambios.',
            confirmButtonColor: '#2D7541',
        });
        return;
    }

    try {
        // Construir el objeto con los datos actualizados de la transferencia
        const updatedTrans = {
            ...transferData,
            status: selectedStatus,
            comentario: comentario, // Incluye el comentario actualizado
        };

        console.log("Parámetros actualizados:", updatedTrans); // Log para verificar los parámetros

        // Realizar la solicitud de actualización de la transferencia utilizando Axios
        await axios.put(`${apiUrl}/transfer/`, updatedTrans);

        // Realizar el reintegro de saldo al trabajador solo si el estado es "Completado"
        if (selectedStatus === 'Completado') {
            await handleReintegroSaldo(workerId, parseFloat(transferData.monto));
        }

        // Deshabilitar la tabla
        setTablaHabilitada(false);

        // Mostrar una alerta de éxito si la actualización se realiza con éxito
        await Swal.fire({
            icon: 'success',
            title: 'Transferencia actualizada',
            text: 'La transferencia se ha actualizado correctamente.',
            confirmButtonColor: '#2D7541',
            didClose: () => {
                // Recargar la página para reflejar los cambios
                window.location.reload();
            },
        });
    } catch (error) {
        // Manejar errores mostrando una alerta de error
        console.error("Error al actualizar la transferencia:", error);
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al actualizar la transferencia.',
            confirmButtonColor: '#2D7541',
        });
    }
};


  const handleReintegroSaldo = async (workerId, amount) => {
    try {
        // Realizar el reintegro al trabajador utilizando Axios
        await axios.put(`${apiUrl}/worker/${workerId}/reintegro`, null, {
          params: {
                cantidadReintegro: amount,
            },
        });
    } catch (error) {
        console.error("Error al realizar el reintegro de saldo:", error);
        throw error; // Propagar el error para que sea manejado por el bloque catch externo
    }
};

  
  
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
      data: trans,
      initialState: { pageSize: 10 },
    },
    useGlobalFilter,
    usePagination
  );

  const { globalFilter, pageIndex } = state;

  const [showViewMore, setShowViewMore] = useState(false);
  const [viewMoreData, setViewMoreData] = useState(null);

  const handleViewMoreClose = () => {
    setShowViewMore(false);
    setViewMoreData(null);
  };


  const handleViewMoreShow = async (data) => {
    setViewMoreData(data);
    setShowViewMore(true);
  
    try {
      // Obtener la imagen del servidor
      const response = await axios.get(`${apiUrl}/transfer/${data.id}/comprobante`, {
        responseType: "arraybuffer",
      });
  
      // Crear una URL a partir de los bytes de la imagen
      const blob = new Blob([response.data], { type: "image/jpeg" });
      const imageUrl = URL.createObjectURL(blob);
      setImagenUrl(imageUrl);
    } catch (error) {
      console.error("Error al obtener la imagen:", error);
    }
  };
  
  
  
  const getCellStyle = (status) => {
    switch (status) {
      case "Pendiente":
        return {
          backgroundColor: "orange",
          width: "100px", // Ancho fijo para el color de fondo
          height: "20px", // Alto fijo para el color de fondo
          borderRadius: "5px",
          color: "white",
        };
      case "Completado":
        return {
          backgroundColor: "green",
          width: "100px", // Ancho fijo para el color de fondo
          height: "20px", // Alto fijo para el color de fondo
          borderRadius: "5px",
          color: "white",
        };
      case "Rechazado":
        return {
          backgroundColor: "red",
          width: "100px", // Ancho fijo para el color de fondo
          height: "20px", // Alto fijo para el color de fondo
          borderRadius: "5px",
          color: "white",
        };
      default:
        return {};
    }
  };



  //VISTA
  return (
    <>
      <div className="container-fluid p-3 my-3">
        <div className="row">
          <Modal show={showViewMore} onHide={handleViewMoreClose}>
            <Modal.Header closeButton>
              <Modal.Title>Reintegrar y modificar</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container>
                <Row>
                  <label>Nombre:</label>
                  <p>{viewMoreData?.descripcion}</p>
                </Row>
                <Row>
                  <label>Fecha:</label>
                  <p>{viewMoreData?.fecha}</p>
                </Row>
                
                <Row>
        <label>Comprobante:</label>
        {/* Espacio para la imagen del comprobante clickeable */}
        <div
          style={{
            width: '95%',
            height: '200px', // Altura de la simulación
            border: '1px solid #ced4da', // Borde para delimitar el espacio
            borderRadius: '5px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '10px',
            marginLeft: '10px',
          }}
        >
          {/* Imagen sin consumo */}
          <img
           src={imagenUrl}
            alt="Imagen General"
            style={{ maxWidth: '100%', maxHeight: '100%' }}
          />
        </div>
      </Row>
   
                

                <Row>
                  <label>Estado:</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    style={{
                      borderRadius: "5px",
                      padding: "5px",
                      border: "transparent",
                      backgroundColor: "transparent", // Fondo transparente
                      outline: "none", // Quita el contorno al enfocar
                      marginLeft: "3px",
                    }}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Completado">Completado</option>
                    <option value="Rechazado">Rechazado</option>
                  </select>
                </Row>

                 
      <Row>
  <label>Comentario:</label>
  <textarea
    value={comentario}
    onChange={handleSetComentario}
    onKeyDown={(e) => e.stopPropagation()}
    style={{
      borderRadius: "5px",
      padding: "5px",
      border: "1px solid #ccc",
      backgroundColor: "#f9f9f9",
      outline: "none",
      marginLeft: "3px",
    }}
  ></textarea>
</Row>


      

              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="success"
                onClick={() => handleUpdateTransfer(viewMoreData)}
              >
                Guardar Cambios
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Tabla de Compras*/}

          <div className="col-12 d-flex justify-content-end">
            <input
              type="text"
              value={globalFilter || ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Buscar Transacción"
              style={{
                marginLeft: "0px",

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
  
   
  
export default ConsultaTransacciones;
