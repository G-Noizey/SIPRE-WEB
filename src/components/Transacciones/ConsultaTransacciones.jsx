import React, { useState, useEffect } from 'react';
import { Button, Container, Modal, Row, Form } from 'react-bootstrap';
import { AiFillEdit } from "react-icons/ai";
import { HiArrowSmRight, HiArrowSmLeft } from "react-icons/hi";
import { FaPlus } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTable, usePagination, useGlobalFilter } from 'react-table';
import axios from 'axios';
import Swal from 'sweetalert2';



function ConsultaTransacciones() {
  return (
    <div>ConsultaTransacciones</div>
  )
}

export default ConsultaTransacciones