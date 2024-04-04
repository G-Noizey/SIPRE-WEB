package mx.edu.utez.sipre.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@Transactional
@RequiredArgsConstructor
public class ServiceEmail {
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    public void sendResetPasswordEmail(String to, String resetLink) {
        Context context = new Context();
        context.setVariable("resetLink", resetLink);
        String process = templateEngine.process("email-template", context);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        try {
            helper.setTo(to);
            helper.setSubject("Recuperación de contraseña");
            helper.setText(process, true);
        } catch (MessagingException e) {
            System.out.printf(e.toString());
        }
        mailSender.send(message);
    }
}
