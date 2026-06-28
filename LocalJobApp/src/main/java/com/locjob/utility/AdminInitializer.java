package com.locjob.utility;

import com.locjob.dao.LoginDao;
import com.locjob.entity.LoginPojo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {

    @Autowired
    private LoginDao loginDao;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // We use logoutUser as it executes SEARCH_USER query by username
        LoginPojo admin = loginDao.logoutUser("admin"); 
        if (admin == null) {
            LoginPojo newAdmin = new LoginPojo();
            newAdmin.setUsername("admin");
            newAdmin.setPassword(passwordEncoder.encode("admin123"));
            newAdmin.setRole("ADMIN");
            newAdmin.setIsActive("Y");
            loginDao.insertLoginDetails(newAdmin);
            System.out.println("Default admin user created: admin / admin123");
        }
    }
}
