package mx.edu.utez.sipre.model.bean;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "admin")
public class BeanAdmin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "name", length = 100, nullable = false)
    private String name;
    @Column(name = "apellido", length = 100, nullable = false)
    private String apellido;
    @Column(name = "email", length = 100, nullable = false, unique = true)
    private String email;
    @Column(name = "password", length = 100, nullable = false)
    private String password;
    @Column(name = "userAdmin", length = 100, nullable = false, unique = true)
    private String userAdmin;
    @Column(name = "status")
    private Boolean status;
    @Column(name = "role", length = 3, nullable = false)
    private int role;
}
