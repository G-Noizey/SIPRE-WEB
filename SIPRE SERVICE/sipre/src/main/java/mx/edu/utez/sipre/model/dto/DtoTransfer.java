package mx.edu.utez.sipre.model.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DtoTransfer {
    private Long id;
    private String descripcion;
    private LocalDate fecha;
    // private Long nuTransferencia;
    private String status;
    private double monto;
    private Long idWorker;
    private Long idDivision;
}
