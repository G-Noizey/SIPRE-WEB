package mx.edu.utez.sipre.model.bean;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "buys")
public class BeanBuys {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;
    @Column(name="descripcion", length = 200, nullable = false)
    private String descripcion;
    @Column(name="fecha", length = 100, nullable = false)
    private String fecha;
    @Column(name="monto", length = 100, nullable = false)
    private double monto;

    @Lob
    @Column(name="comprobante", nullable = false)
    private byte[] comprobante;

    @ManyToOne
    @JoinColumn(name = "idWorker", nullable = false)
    private BeanWorker beanWorker;

    @ManyToOne
    @JoinColumn(name = "idDivision", nullable = false)
    private BeanDivision beanDivision;
}
