package mx.edu.utez.sipre.model.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DtoWorker {
    private long id;
    private String name;
    private String lastname;
    private String email;
    private String password;
    private int status;
    private String userWorker;
    private double saldo;
    private int telefono;
    private String direccion;
    private long idDivision;
}
