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
@Table(name = "buys")



public class BeanBuys {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;
    @Column(name="descripcion", length = 200, nullable = false)
    private String descripcion;
    @Column(name="fecha", nullable = false)
    private LocalDate fecha;
    @Column(name="monto", length = 100, nullable = false)
    private double monto;


    /**
     * Esta anotación especifica que el atributo 'comprobante' se mapeará a una columna en la base de datos.
     * El tipo de columna será LONGBLOB, lo que generalmente se usa para almacenar grandes cantidades de datos binarios.
     * La columna no puede ser nula (nullable = false). Este atributo probablemente almacene un archivo binario grande,
     * como una imagen, un archivo PDF, etc.
     */

    @Lob
    @Column(name="comprobante", columnDefinition = "LONGBLOB", nullable = false)
    private byte[] comprobante;



    @Column(name="status", length = 20, nullable = false)
    private String status;

    @Column(name = "comentario", length = 400)
    private String comentario;


    @ManyToOne
    @JoinColumn(name = "idWorker", nullable = false)
    private BeanWorker beanWorker;

    @ManyToOne
    @JoinColumn(name = "idDivision", nullable = false)
    private BeanDivision beanDivision;
}
