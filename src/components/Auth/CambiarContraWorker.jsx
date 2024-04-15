import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from 'yup';
import SIPREImage from "../../../dist/assets/images/SIPRE 1.png";
import SIPRElogo from "../../../dist/assets/images/logo2.png";

//RUTA DE LA API
const apiUrl = import.meta.env.VITE_API_URL;



const CambiarContraWorker = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');

    const validationSchema = Yup.object({
        password: Yup.string()
            .min(8, 'La contraseña debe tener al menos 8 caracteres')
            .matches(/[a-z]/, 'La contraseña debe contener al menos una minúscula')
            .matches(/[A-Z]/, 'La contraseña debe contener al menos una mayúscula')
            .matches(/[0-9]/, 'La contraseña debe contener al menos un número')
            .matches(/^[a-zA-Z0-9]*$/, 'La contraseña no debe contener caracteres especiales, espacios o acentos')
            .required('Campo requerido'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
            .required('Campo requerido'),
    });

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleUpdate(values.password);
        },
    });

    const handleUpdate = (newPassword) => {
        axios
        .put(`${apiUrl}/worker/update-password`, null, {
            params: { email: email, newPassword: newPassword },
            })
            .then((response) => {
                Swal.fire({
                    icon: "success",
                    title: "Contraseña actualizada",
                    text: "Tu contraseña ha sido actualizada con éxito. Ya puedes cerrar esta ventana y volver a iniciar sesión desde la app.",
                });
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudo actualizar la contraseña",
                });
            });
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
                                        src={SIPREImage}
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
                                                    src={SIPRElogo}
                                                    alt="Descripción de la imagen"
                                                    style={{ width: "100px" }}
                                                />
                                            </div>
                                            <h1
                                                className=" mb-3 pb-3"
                                                style={{ letterSpacing: "1px" }}
                                            >
                                                Cambiar contraseña
                                            </h1>
                                            <div className="form-outline mb-4">
                                                <input
                                                    type="password"
                                                    id="password"
                                                    className="form-control form-control-lg"
                                                    {...formik.getFieldProps('password')}
                                                />
                                                <label className="form-label" htmlFor="password">
                                                    Nueva contraseña
                                                </label>
                                                {formik.touched.password && formik.errors.password ? (
                                                    <div className="text-danger">{formik.errors.password}</div>
                                                ) : null}
                                            </div>
                                            <div className="form-outline mb-4">
                                                <input
                                                    type="password"
                                                    id="confirmPassword"
                                                    className="form-control form-control-lg"
                                                    {...formik.getFieldProps('confirmPassword')}
                                                />
                                                <label className="form-label" htmlFor="confirmPassword">
                                                    Confirmar contraseña
                                                </label>
                                                {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                                    <div className="text-danger">{formik.errors.confirmPassword}</div>
                                                ) : null}
                                            </div>
                                            <div className="pt-1 mb-4">
                                                <button
                                                    className="btn btn-lg shadow-lg"
                                                    type="button"
                                                    style={{
                                                        backgroundColor: "#2D7541",
                                                        color: "white",
                                                        padding: "5px 150px",
                                                        margin: "10px",
                                                    }}
                                                    disabled={!formik.isValid || formik.isSubmitting}
                                                >
                                                    Actualizar contraseña
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

export default CambiarContraWorker;
