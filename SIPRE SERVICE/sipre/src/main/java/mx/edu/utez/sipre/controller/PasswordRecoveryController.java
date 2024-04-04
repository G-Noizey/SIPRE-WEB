package mx.edu.utez.sipre.controller;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sipre.model.dto.PasswordResetRequestDto;
import mx.edu.utez.sipre.service.ServiceEmail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reset-password")
@CrossOrigin(origins = {"*"})
@RequiredArgsConstructor
public class PasswordRecoveryController {
    private final ServiceEmail emailService;

    @PostMapping("/enviar-correo")
    public ResponseEntity<?> sendRecoveryEmail(@RequestBody PasswordResetRequestDto requestDto) {
        String to = requestDto.getEmail();
        String resetLink = "http://localhost:5173/cambiar-contra?email=" + to;

        emailService.sendResetPasswordEmail(to, resetLink);

        return ResponseEntity.ok("Correo de recuperación enviado.");
    }
}
