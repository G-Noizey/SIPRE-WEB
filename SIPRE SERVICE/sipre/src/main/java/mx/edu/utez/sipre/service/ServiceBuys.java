package mx.edu.utez.sipre.service;

import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;


import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.properties.VerticalAlignment;
import lombok.RequiredArgsConstructor;
import mx.edu.utez.sipre.model.bean.BeanBuys;
import mx.edu.utez.sipre.model.bean.BeanDivision;
import mx.edu.utez.sipre.model.bean.BeanTransferencia;
import mx.edu.utez.sipre.model.bean.BeanWorker;
import mx.edu.utez.sipre.model.dto.DtoBuys;
import mx.edu.utez.sipre.model.repositories.RepoBuys;
import mx.edu.utez.sipre.model.repositories.RepoDivision;
import mx.edu.utez.sipre.model.repositories.RepoTransfer;
import mx.edu.utez.sipre.model.repositories.RepoWorker;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;


import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.PathVariable;


@Service
@Transactional
@RequiredArgsConstructor
public class ServiceBuys {
    private final RepoBuys repoBuys;
    private final RepoWorker repoWorker;
    private final RepoDivision repoDivision;
    private final RepoTransfer repoTransfer;

    @Transactional(readOnly = true)
    public ResponseEntity<List<BeanBuys>> getAllBuys() {
        List<BeanBuys> buys = repoBuys.findAll();
        return ResponseEntity.ok().body(buys);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<BeanBuys> getBuysById(Long id) {
        Optional<BeanBuys> buysOptional = repoBuys.findById(id);
        return buysOptional.map(buys -> ResponseEntity.ok().body(buys)).orElseGet(() -> ResponseEntity.notFound().build());

    }

    @Transactional(rollbackFor = {Exception.class})
    public ResponseEntity<String> save(DtoBuys dtoBuys) {
        try {
            // Obtener la división basada en el ID proporcionado en el DTO
            Optional<BeanDivision> optionalDivision = repoDivision.findById(dtoBuys.getIdDivision());
            if (!optionalDivision.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró la división con el ID proporcionado: " + dtoBuys.getIdDivision());
            }
            BeanDivision buysDivision = optionalDivision.get();

            // Obtener el trabajador basado en el ID proporcionado en el DTO
            Optional<BeanWorker> optionalWorker = repoWorker.findById(dtoBuys.getIdWorker());
            if (!optionalWorker.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró el trabajador con el ID proporcionado: " + dtoBuys.getIdWorker());
            }
            BeanWorker worker = optionalWorker.get();

            // Crear la compra sin especificar el ID
            BeanBuys buys = BeanBuys.builder()
                    .beanWorker(worker)
                    .beanDivision(buysDivision)
                    .monto(dtoBuys.getMonto())
                    .status(dtoBuys.getStatus())
                    .fecha(dtoBuys.getFecha())
                    .descripcion(dtoBuys.getDescripcion())
                    //NUEVO DATO (NOIZEY)
                    .comentario(dtoBuys.getComentario())
                    .build();

            // Guardar la compra en la base de datos y dejar que la base de datos genere automáticamente el ID
            repoBuys.save(buys);

            // Devolver una respuesta con el estado CREATED y un mensaje indicando que la compra se creó exitosamente
            return ResponseEntity.status(HttpStatus.CREATED).body("Compra creada exitosamente");
        } catch (Exception e) {
            // Manejar cualquier excepción y revertir la transacción
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ocurrió un error al guardar la compra");
        }
    }


    @Transactional(rollbackFor = {Exception.class})
    public ResponseEntity<String> update(DtoBuys dtoBuys) {
        try {
            // Verificar si el DTO contiene un ID válido
            Long buysId = dtoBuys.getId();
            if (buysId == null) {
                return ResponseEntity.badRequest().body("El DTO no contiene un ID válido para la compra");
            }

            // Verificar si la compra existe en la base de datos
            Optional<BeanBuys> existingBuysOptional = repoBuys.findById(buysId);
            if (existingBuysOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró ninguna compra con ID: " + buysId);
            }

            // Obtener la compra existente
            BeanBuys existingBuys = existingBuysOptional.get();

            // Actualizar los campos de la compra existente con los valores del DTO
            existingBuys.setMonto(dtoBuys.getMonto());
            existingBuys.setStatus(dtoBuys.getStatus());
            existingBuys.setFecha(dtoBuys.getFecha());
            existingBuys.setDescripcion(dtoBuys.getDescripcion());
            //NUEVO DATO
            existingBuys.setComentario(dtoBuys.getComentario());

            // Guardar la compra actualizada en la base de datos
            repoBuys.save(existingBuys);

            // Devolver una respuesta con el estado OK y un mensaje indicando que la compra se actualizó exitosamente
            return ResponseEntity.ok().body("Compra actualizada exitosamente");
        } catch (Exception e) {
            // Manejar cualquier excepción y revertir la transacción
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ocurrió un error al actualizar la compra");
        }
    }


    public ResponseEntity<byte[]> getComprobante(Long id) {
        try {
            // Obtener la compra basada en el ID proporcionado
            Optional<BeanBuys> optionalBuys = repoBuys.findById(id);
            if (optionalBuys.isPresent()) {
                // Obtener los bytes del comprobante de la compra
                BeanBuys compra = optionalBuys.get();
                byte[] comprobante = compra.getComprobante();

                // Devolver los bytes del comprobante como respuesta
                return ResponseEntity.ok().body(comprobante);
            } else {
                // La compra no fue encontrada, devolver un error 404
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            // Manejar cualquier excepción y devolver un error 500
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    //GENERADOR DE PDF (ESTADO DE CUENTA DIVISION)  (NOIZEY)
    public ResponseEntity<byte[]> generatePDF(@PathVariable Long divisionId) {
        try {
            // Obtener el nombre de la división
            String divisionName = repoDivision.findById(divisionId).get().getName();

            // Obtener las compras completadas de la división especificada
            List<BeanBuys> completedBuys = repoBuys.findByBeanDivisionIdAndStatus(divisionId, "Completado");

            // Obtener las transferencias completadas de la división especificada
            List<BeanTransferencia> transferencias = repoTransfer.findByBeanDivisionTrans_Id(divisionId);

            // Obtener el BeanWorker asociado a una de las compras completadas
            BeanWorker worker = completedBuys.get(0).getBeanWorker();

            // Crear el documento PDF con los detalles de las compras completadas
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf, PageSize.A4);

            // Agregar espacio en blanco
            document.add(new Paragraph(" "));

            // Agregar campo para agregar imagen a la izquierda del título
            Table imageTable = new Table(new float[]{1, 4});
            imageTable.setWidth(UnitValue.createPercentValue(100));

            Cell imageCell = new Cell();
            Image img = new Image(ImageDataFactory.create("classpath:logo.png"));
            img.setWidth(UnitValue.createPercentValue(10));

            Paragraph paragraph = new Paragraph();
            paragraph.add(img);

            PdfFont font = PdfFontFactory.createFont();
            Text text = new Text("Estado de cuenta de la división: " + divisionName)
                    .setFont(font)
                    .setFontSize(20)
                    .setFontColor(new DeviceRgb(45, 117, 65))
                    .setTextAlignment(TextAlignment.CENTER);

            paragraph.add(text);

            imageCell.add(paragraph);
            imageCell.setBorder(Border.NO_BORDER); // Eliminar bordes de la celda
            imageCell.setVerticalAlignment(VerticalAlignment.TOP); // Alinear el texto en la parte superior de la celda
            imageTable.addCell(imageCell);

            document.add(imageTable);

            // Agregar espacio en blanco
            document.add(new Paragraph(" "));

            // Agregar texto encima de la tabla de compras
            document.add(new Paragraph("Compras realizadas:").setFont(font).setBold().setFontSize(16).setFontColor(new DeviceRgb(45, 117, 65)));

            // Agregar tabla con los detalles de las compras
            Table table = new Table(new float[]{4, 2, 2, 2}); // Añadir una columna más para el nombre del trabajador
            table.setWidth(UnitValue.createPercentValue(100));

            // Establecer color de borde de las celdas
            table.setBorder(new SolidBorder(new DeviceRgb(45, 117, 65), 1)); // Grosor de borde 1pt

            // Encabezados de la tabla
            Cell cell = new Cell().add(new Paragraph("Trabajador").setBold());
            cell.setBorder(new SolidBorder(new DeviceRgb(45, 117, 65), 1)); // Establecer color de borde
            table.addCell(cell);

            cell = new Cell().add(new Paragraph("Descripción").setBold());
            cell.setBorder(new SolidBorder(new DeviceRgb(45, 117, 65), 1)); // Establecer color de borde
            table.addCell(cell);

            cell = new Cell().add(new Paragraph("Monto").setBold());
            cell.setBorder(new SolidBorder(new DeviceRgb(45, 117, 65), 1)); // Establecer color de borde
            table.addCell(cell);

            cell = new Cell().add(new Paragraph("Fecha de movimiento").setBold());
            cell.setBorder(new SolidBorder(new DeviceRgb(45, 117, 65), 1)); // Establecer color de borde
            table.addCell(cell);

            // Datos de las compras
            for (BeanBuys buy : completedBuys) {
                table.addCell(new Cell().add(new Paragraph(worker.getName())).setBorder(new SolidBorder(new DeviceRgb(45, 117, 65), 1))); // Establecer color de borde
                table.addCell(new Cell().add(new Paragraph(buy.getDescripcion())).setBorder(new SolidBorder(new DeviceRgb(45, 117, 65), 1))); // Establecer color de borde
                table.addCell(new Cell().add(new Paragraph(String.valueOf(buy.getMonto()))).setBorder(new SolidBorder(new DeviceRgb(45, 117, 65), 1))); // Establecer color de borde
                table.addCell(new Cell().add(new Paragraph(String.valueOf(buy.getFecha()))).setBorder(new SolidBorder(new DeviceRgb(45, 117, 65), 1))); // Establecer color de borde
            }

            document.add(table);

            // Agregar espacio en blanco
            document.add(new Paragraph(" "));

            // Agregar texto encima de la tabla de transferencias
            document.add(new Paragraph("Transacciones realizadas:").setFont(font).setBold().setFontSize(16).setFontColor(new DeviceRgb(45, 117, 65)));

            // Agregar tabla con los detalles de las transferencias
            Table transferTable = new Table(new float[]{4, 2, 2, 2}); // Añadir una columna más para el nombre del trabajador
            transferTable.setWidth(UnitValue.createPercentValue(100));

            // Establecer color de borde de las celdas
            transferTable.setBorder(new SolidBorder(new DeviceRgb(45, 117, 65), 1)); // Grosor de borde 1pt

            // Encabezados de la tabla
            Cell transferCell = new Cell().add(new Paragraph("Trabajador").setBold());
            transferCell.setBorder(new SolidBorder(new DeviceRgb(45, 117, 65), 1)); // Establecer color de borde
            transferTable.addCell(transferCell);

            transferCell = new Cell().add(new Paragraph("Descripción").setBold());
            transferCell.setBorder(new SolidBorder(new DeviceRgb(45, 117, 65), 1)); // Establecer color de borde
            transferTable.addCell(transferCell);

            transferCell = new Cell().add(new Paragraph("Monto").setBold());
            transferCell.setBorder(new SolidBorder(new DeviceRgb(45, 117, 65), 1)); // Establecer color de borde
            transferTable.addCell(transferCell);

            transferCell = new Cell().add(new Paragraph("Fecha de movimiento").setBold());
            transferCell.setBorder(new SolidBorder(new DeviceRgb(45, 117, 65), 1)); // Establecer color de borde
            transferTable.addCell(transferCell);

            // Datos de las transferencias
            for (BeanTransferencia transfer : transferencias) {
                transferTable.addCell(new Cell().add(new Paragraph(worker.getName())).setBorder(new SolidBorder(new DeviceRgb(45, 117, 65), 1))); // Establecer color de borde
                transferTable.addCell(new Cell().add(new Paragraph(transfer.getDescripcion())).setBorder(new SolidBorder(new DeviceRgb(45, 117, 65), 1))); // Establecer color de borde
                transferTable.addCell(new Cell().add(new Paragraph(String.valueOf(transfer.getMonto()))).setBorder(new SolidBorder(new DeviceRgb(45, 117, 65), 1))); // Establecer color de borde
                transferTable.addCell(new Cell().add(new Paragraph(String.valueOf(transfer.getFecha()))).setBorder(new SolidBorder(new DeviceRgb(45, 117, 65), 1))); // Establecer color de borde
            }

            document.add(transferTable);

            document.close();

            // Devolver el PDF como un array de bytes en la respuesta
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(outputStream.toByteArray());
        } catch (Exception e) {
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }




    public ResponseEntity<byte[]> generatePDFWorker(@PathVariable Long idTrabajador) {
        try {
            // Obtener el nombre del trabajador
            String nombreTrabajador = repoWorker.findById(idTrabajador).get().getName();

            // Obtener las compras completadas del trabajador especificado
            List<BeanBuys> comprasCompletadas = repoBuys.findByBeanWorkerIdAndStatus(idTrabajador, "Completado");

            // Obtener las transferencias completadas del trabajador especificado
            List<BeanTransferencia> transferencias = repoTransfer.findByBeanWorkerTrans_Id(idTrabajador);

            // Crear el documento PDF con los detalles de las compras completadas
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf, PageSize.A4);

            // Agregar espacio en blanco
            document.add(new Paragraph(" "));

            // Agregar campo para agregar imagen a la izquierda del título
            Table imageTable = new Table(new float[]{1, 4});
            imageTable.setWidth(UnitValue.createPercentValue(100));

            Cell imageCell = new Cell();
            Image img = new Image(ImageDataFactory.create("classpath:logo.png"));
            img.setWidth(UnitValue.createPercentValue(10));

            Paragraph paragraph = new Paragraph();
            paragraph.add(img);

            PdfFont font = PdfFontFactory.createFont();
            Text text = new Text("Estado de cuenta del trabajador: " + nombreTrabajador)
                    .setFont(font)
                    .setFontSize(20)
                    .setFontColor(new DeviceRgb(45, 117, 65))
                    .setTextAlignment(TextAlignment.CENTER);

            paragraph.add(text);

            imageCell.add(paragraph);
            imageCell.setBorder(Border.NO_BORDER); // Eliminar bordes de la celda
            imageCell.setVerticalAlignment(VerticalAlignment.TOP); // Alinear el texto en la parte superior de la celda
            imageTable.addCell(imageCell);

            document.add(imageTable);

            // Agregar espacio en blanco
            document.add(new Paragraph(" "));

            // Agregar texto encima de la tabla de compras
            document.add(new Paragraph("Compras realizadas:").setFont(font).setBold().setFontSize(16).setFontColor(new DeviceRgb(45, 117, 65)));

            // Agregar tabla con los detalles de las compras
            Table table = new Table(new float[]{4, 2, 2}); // No es necesario añadir una columna más para el nombre del trabajador, ya que es el trabajador mismo
            table.setWidth(UnitValue.createPercentValue(100));

            // Establecer color de borde de las celdas
            table.setBorder(new SolidBorder(new DeviceRgb(45, 117, 65), 1)); // Grosor de borde 1pt

            // Encabezados de la tabla
            Cell cell = new Cell().add(new Paragraph("Descripción").setBold());
            cell.setBorder(new SolidBorder(new DeviceRgb(45, 117, 65), 1)); // Establecer color de borde
            table.addCell(cell);

            cell = new Cell().add(new Paragraph("Monto").setBold());
            cell.setBorder(new SolidBorder(new DeviceRgb(45, 117, 65), 1)); // Establecer color de borde
            table.addCell(cell);

            cell = new Cell().add(new Paragraph("Fecha de movimiento").setBold());
            cell.setBorder(new SolidBorder(new DeviceRgb(45, 117, 65), 1)); // Establecer color de borde
            table.addCell(cell);

            // Datos de las compras
            for (BeanBuys compra : comprasCompletadas) {
                table.addCell(new Cell().add(new Paragraph(compra.getDescripcion())).setBorder(new SolidBorder(new DeviceRgb(45, 117, 65), 1))); // Establecer color de borde
                table.addCell(new Cell().add(new Paragraph(String.valueOf(compra.getMonto()))).setBorder(new SolidBorder(new DeviceRgb(45, 117, 65), 1))); // Establecer color de borde
                table.addCell(new Cell().add(new Paragraph(String.valueOf(compra.getFecha()))).setBorder(new SolidBorder(new DeviceRgb(45, 117, 65), 1))); // Establecer color de borde
            }

            document.add(table);

            // Agregar espacio en blanco
            document.add(new Paragraph(" "));

            // Agregar texto encima de la tabla de transferencias
            document.add(new Paragraph("Transacciones realizadas:").setFont(font).setBold().setFontSize(16).setFontColor(new DeviceRgb(45, 117, 65)));

            // Agregar tabla con los detalles de las transferencias
            Table transferTable = new Table(new float[]{4, 2, 2}); // No es necesario añadir una columna más para el nombre del trabajador, ya que es el trabajador mismo
            transferTable.setWidth(UnitValue.createPercentValue(100));

            // Establecer color de borde de las celdas
            transferTable.setBorder(new SolidBorder(new DeviceRgb(45, 117, 65), 1)); // Grosor de borde 1pt

            // Encabezados de la tabla
            Cell transferCell = new Cell().add(new Paragraph("Descripción").setBold());
            transferCell.setBorder(new SolidBorder(new DeviceRgb(45, 117, 65), 1)); // Establecer color de borde
            transferTable.addCell(transferCell);

            transferCell = new Cell().add(new Paragraph("Monto").setBold());
            transferCell.setBorder(new SolidBorder(new DeviceRgb(45, 117, 65), 1)); // Establecer color de borde
            transferTable.addCell(transferCell);

            transferCell = new Cell().add(new Paragraph("Fecha de movimiento").setBold());
            transferCell.setBorder(new SolidBorder(new DeviceRgb(45, 117, 65), 1)); // Establecer color de borde
            transferTable.addCell(transferCell);

            // Datos de las transferencias
            for (BeanTransferencia transferencia : transferencias) {
                transferTable.addCell(new Cell().add(new Paragraph(transferencia.getDescripcion())).setBorder(new SolidBorder(new DeviceRgb(45, 117, 65), 1))); // Establecer color de borde
                transferTable.addCell(new Cell().add(new Paragraph(String.valueOf(transferencia.getMonto()))).setBorder(new SolidBorder(new DeviceRgb(45, 117, 65), 1))); // Establecer color de borde
                transferTable.addCell(new Cell().add(new Paragraph(String.valueOf(transferencia.getFecha()))).setBorder(new SolidBorder(new DeviceRgb(45, 117, 65), 1))); // Establecer color de borde
            }

            document.add(transferTable);

            document.close();

            // Devolver el PDF como un array de bytes en la respuesta
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(outputStream.toByteArray());
        } catch (Exception e) {
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }







}