package mx.edu.utez.sipre.model.dto;

import lombok.*;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PasswordResetRequestDto {
    private String email;
}
