package mx.edu.utez.sipre.model.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DtoBuys {
    private Long id;
    private String descripcion;
    private String fecha;
    private double monto;
    private Long idWorker;
    private Long idDivision;
    private byte[] comprobante;
}
