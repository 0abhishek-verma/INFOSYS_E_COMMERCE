package com.infosys.project.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailOtpService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    public EmailOtpService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendRegistrationOtp(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Your registration OTP");
        message.setText("Your OTP for registration is: " + otp + "\n\nThis code expires in 10 minutes.");

        try {
            mailSender.send(message);
        } catch (MailAuthenticationException ex) {
            throw new RuntimeException(
                    "SMTP authentication failed. Set MAIL_PASSWORD to a valid SMTP/app password for "
                            + fromEmail
                            + " (Gmail requires an App Password with 2FA).",
                    ex
            );
        } catch (MailException ex) {
            throw new RuntimeException("Unable to send OTP email right now. Please try again.", ex);
        }
    }
}
