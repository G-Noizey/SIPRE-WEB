package mx.edu.utez.sipre.model.bean;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "division")
public class BeanDivision {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;
    @Column(name = "name", length = 100, nullable = false, unique = true)
    private String name;
    @Column(name = "status")
    private Boolean status;
    @Column(name = "siglas", length = 100, nullable = false, unique = true)
    private String siglas;
    @Column(name = "saldo", length = 9, nullable = false)
    private Double saldo;
    @Column(name = "saldototal", length = 9)
    private Double saldototal;
    @OneToMany(mappedBy = "division")
    @JsonIgnore
    private List<BeanWorker> workers;

    @OneToMany(mappedBy = "beanDivision")
    @JsonIgnore
    private List<BeanBuys> buys;
}
