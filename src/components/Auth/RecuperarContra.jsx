import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from 'yup';

const RecuperarContra = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Debe ser una dirección de correo válida')
      .required('Campo requerido'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleSendEmail(values.email);
    },
  });

  const handleSendEmail = async (email) => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/reset-password/enviar-correo", {
        email: email
      }).then((response) => {
        Swal.fire({
          icon: 'success',
          title: '¡Correo enviado con éxito!',
          text: 'El correo con ha sido enviado exitosamente. Revisa tu bandeja de entrada.',
          confirmButtonColor: '#2D7541'
        }).then(() => {
          navigate('/');
        });
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '¡Error al enviar el correo!',
        text: 'Hubo un problema al intentar enviar el correo.',
        confirmButtonColor: '#2D7541'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      className="vh-100"
      style={{ backgroundColor: "white", fontFamily: "Montserrat, sans-serif" }}
    >
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card">
              <div className="row g-0">
                <div
                  className="col-md-6 col-lg-5 d-none d-md-block"
                  style={{ backgroundColor: "#2D7541" }}
                >
                  <img
                    src="../../public/assets/images/SIPRE 1.png"
                    alt="login form"
                    className="img-fluid"
                    style={{ width: "250px", margin: "140px 100px" }}
                  />
                </div>
                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5 text-black text-center">
                    <form onSubmit={formik.handleSubmit}>
                      <div className="d-flex align-items-center mb-3 pb-1">
                        <i
                          className="fas fa-cubes fa-2x me-3"
                          style={{ color: "#ff6219" }}
                        ></i>
                        <img
                          src="../../public/assets/images/logo2.png"
                          alt="Descripción de la imagen"
                          style={{ width: "100px" }}
                        />
                      </div>
                      <h1
                        className=" mb-3 pb-3"
                        style={{ letterSpacing: "1px" }}
                      >
                        Solicitar cambio de contraseña
                      </h1>
                      <div className="form-outline mb-4">
                        <input
                          type="email"
                          id="form2Example17"
                          className="form-control form-control-lg"
                          {...formik.getFieldProps('email')}
                        />
                        <label className="form-label" htmlFor="form2Example17">
                          Correo:
                        </label>
                        {formik.touched.email && formik.errors.email ? (
                          <div className="text-danger">{formik.errors.email}</div>
                        ) : null}
                      </div>
                      <div className="pt-1 mb-4">
                        <button
                          className="btn btn-lg shadow-lg"
                          type="submit"
                          style={{
                            backgroundColor: "#2D7541",
                            color: "white",
                            padding: "5px 150px",
                            margin: "10px",
                          }}
                          disabled={isLoading || !formik.isValid}
                        >
                          {isLoading ? (
                            <>
                              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                              <span className="visually-hidden">Enviando...</span>
                            </>
                          ) : (
                            'Enviar correo'
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecuperarContra;