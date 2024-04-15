package mx.edu.utez.sipre.controller;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sipre.model.dto.PasswordResetRequestDto;
import mx.edu.utez.sipre.service.ServiceEmail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reset-password-worker")
@CrossOrigin(origins = {"*"})
@RequiredArgsConstructor
public class PasswordRecoveryWorkerController {
    private final ServiceEmail emailService;

    @PostMapping("/enviar-correo-worker")
    public ResponseEntity<?> sendRecoveryEmail(@RequestBody PasswordResetRequestDto requestDto) {
        String to = requestDto.getEmail();
        String resetLink = "http://sipre-front.s3-website-us-east-1.amazonaws.com/cambiar-contra-trabajador?email=" + to;

        emailService.sendResetPasswordEmail(to, resetLink);

        return ResponseEntity.ok("Correo de recuperación enviado.");
    }
}
