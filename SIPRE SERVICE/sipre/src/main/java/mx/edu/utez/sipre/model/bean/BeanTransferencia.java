package mx.edu.utez.sipre.model.bean;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "transfer")
public class BeanTransferencia {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;
    @Column(name="descripcion", length = 200, nullable = false)
    private String descripcion;
    @Column(name="fecha", nullable = false)
    private LocalDate fecha;
    @Column(name="monto", length = 100, nullable = false)
    private double monto;
    @Column(name="status", length = 20, nullable = false)
    private String status;
    @ManyToOne
    @JoinColumn(name = "idWorker", nullable = false)
    private BeanWorker beanWorkerTrans;

    @ManyToOne
    @JoinColumn(name = "idDivision", nullable = false)
    private BeanDivision beanDivisionTrans;
}
