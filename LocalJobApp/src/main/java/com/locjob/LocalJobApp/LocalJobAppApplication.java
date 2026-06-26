package com.locjob.LocalJobApp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.locjob")
@EntityScan(basePackages = "com.locjob.entity") 
public class LocalJobAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(LocalJobAppApplication.class, args);
	}

}
