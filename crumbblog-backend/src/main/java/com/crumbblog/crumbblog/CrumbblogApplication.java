package com.crumbblog.crumbblog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class CrumbblogApplication {

    public static void main(String[] args) {
        SpringApplication.run(CrumbblogApplication.class, args);
    }

}
