package com.locjob.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendBookingNotificationToProvider(
            String providerEmail,
            String customerName,
            String serviceName
    ) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(providerEmail);

        message.setSubject("New Booking Request");

        message.setText(
                "Hello Provider,\n\n" +
                customerName +
                " has booked your " +
                serviceName +
                " service.\n\n" +
                "Please login to LocalJobApp for more details."
        );
        
        System.out.println("INSIDE EMAIL SERVICE");
        mailSender.send(message);
    }
}