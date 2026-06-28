package com.locjob.service.Impl;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.locjob.dao.LoginDao;
import com.locjob.dao.ServiceUserDao;
import com.locjob.entity.LoginPojo;
import com.locjob.entity.ServiceUserPojo;
import com.locjob.pojo.RequestPojo;
import com.locjob.pojo.ResponsePojo;
import com.locjob.service.ServiceUserService;
import com.locjob.utility.AppConstant;

@Component
public class ServiceUserServiceImpl implements ServiceUserService {

    @Autowired
    ServiceUserDao serviceUserDao;

    @Autowired
    LoginDao loginDao;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Override
    public ResponsePojo userRegistration(RequestPojo requestPojo) {
        ResponsePojo response = new ResponsePojo();
        Map<String, Object> resMap = new HashMap<>();
        System.out.println(requestPojo.toString());

        ServiceUserPojo suPojo = new ServiceUserPojo();
        suPojo.setFirstName(requestPojo.getFirstName());
        suPojo.setLastName(requestPojo.getLastName());
        suPojo.setMobileNo(requestPojo.getMobileNo());
        suPojo.setEmailId(requestPojo.getEmailId());
        suPojo.setAddress(requestPojo.getAddress());
        suPojo.setLocation(requestPojo.getLocation());
        suPojo.setCity(requestPojo.getCity());
        suPojo.setUserName(requestPojo.getUserName());
        suPojo.setPassword(requestPojo.getPassword());
        suPojo.setIsActive(AppConstant.Y);

        try {
            boolean userInserted = serviceUserDao.insertServiceUser(suPojo);
            if (userInserted) {
                LoginPojo lPojo = new LoginPojo();
                lPojo.setUsername(requestPojo.getUserName());
                // Hash the password before saving to the database
                lPojo.setPassword(passwordEncoder.encode(requestPojo.getPassword()));
                lPojo.setRole(AppConstant.USER);
                lPojo.setIsActive(AppConstant.Y);
                lPojo.setLoginStatus(AppConstant.LOGIN);
                lPojo.setFailedAttempts(0);
                lPojo.setLastLoginTime(LocalDateTime.now());

                boolean loginInserted = loginDao.insertLoginDetails(lPojo);
                if (loginInserted) {
                    response.setStatus(AppConstant.SUCCESS);
                    response.setMsg("User Registered Successfully");
                    resMap.put("userName", lPojo.getUsername());
                    response.setResponseMap(resMap);
                } else {
                    response.setStatus(AppConstant.FAILED);
                    response.setMsg("Login record creation failed");
                }
            } else {
                response.setStatus(AppConstant.FAILED);
                response.setMsg("User registration failed");
            }
        } catch (Exception ex) {
            response.setStatus(AppConstant.FAILED);
            response.setMsg("Error: " + ex.getMessage());
            System.out.println(ex.getMessage());
        }
        return response;
    }

    @Override
    public ResponsePojo userUpdation(RequestPojo requestPojo) {
        ResponsePojo response = new ResponsePojo();
        try {
            ServiceUserPojo suPojo = new ServiceUserPojo();
            suPojo.setId(requestPojo.getId());
            suPojo.setFirstName(requestPojo.getFirstName());
            suPojo.setLastName(requestPojo.getLastName());
            suPojo.setMobileNo(requestPojo.getMobileNo());
            suPojo.setEmailId(requestPojo.getEmailId());
            suPojo.setAddress(requestPojo.getAddress());
            suPojo.setLocation(requestPojo.getLocation());
            suPojo.setCity(requestPojo.getCity());
            suPojo.setIsActive(AppConstant.Y);

            boolean updated = serviceUserDao.updateServiceUser(suPojo);
            if (updated) {
                response.setStatus(AppConstant.SUCCESS);
                response.setMsg("User updated successfully");
            } else {
                response.setStatus(AppConstant.FAILED);
                response.setMsg("Update failed");
            }
        } catch (Exception ex) {
            response.setStatus(AppConstant.FAILED);
            response.setMsg("Error: " + ex.getMessage());
        }
        return response;
    }

    @Override
    public ResponsePojo getUserData(RequestPojo requestPojo) {
        ResponsePojo response = new ResponsePojo();
        Map<String, Object> resMap = new HashMap<>();
        try {
            ServiceUserPojo su = serviceUserDao.getServiceUser(
                requestPojo.getUserName(), requestPojo.getPassword());
            if (su != null) {
                resMap.put("id",        su.getId());
                resMap.put("firstName", su.getFirstName());
                resMap.put("lastName",  su.getLastName());
                resMap.put("mobileNo",  su.getMobileNo());
                resMap.put("emailId",   su.getEmailId());
                resMap.put("city",      su.getCity());
                response.setStatus(AppConstant.SUCCESS);
                response.setMsg("User data fetched");
                response.setResponseMap(resMap);
            } else {
                response.setStatus(AppConstant.FAILED);
                response.setMsg("User not found");
            }
        } catch (Exception ex) {
            response.setStatus(AppConstant.FAILED);
            response.setMsg("Error: " + ex.getMessage());
        }
        return response;
    }
}