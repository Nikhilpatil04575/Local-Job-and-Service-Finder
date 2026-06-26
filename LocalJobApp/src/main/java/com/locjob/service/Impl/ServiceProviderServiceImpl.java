package com.locjob.service.Impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.locjob.dao.LoginDao;
import com.locjob.dao.ProviderDao;
import com.locjob.entity.LoginPojo;
import com.locjob.entity.ServiceProviderPojo;
import com.locjob.pojo.RequestPojo;
import com.locjob.pojo.ResponsePojo;
import com.locjob.service.ServiceProviderService;
import com.locjob.utility.AppConstant;

@Component
public class ServiceProviderServiceImpl implements ServiceProviderService {

    @Autowired
    ProviderDao providerDao;

    @Autowired
    LoginDao loginDao;

    @Override
    @Transactional // This is the only place you need this annotation
    public ResponsePojo serviceProviderRegistration(RequestPojo requestPojo) {
        ResponsePojo response = new ResponsePojo();
        Map<String, Object> resMap = new HashMap<>();

        try {
            // 1. PREVENT ROLLBACK: Check if username already exists in Login table
            // This prevents the "Poisoned Transaction" issue
            LoginPojo existingLogin = loginDao.loginUser(requestPojo.getUserName(), null, null);
            if (existingLogin != null) {
                response.setStatus(AppConstant.FAILED);
                response.setMsg("Username already exists. Please choose another.");
                return response;
            }

            // 2. Create Provider
            ServiceProviderPojo spPojo = new ServiceProviderPojo();
            spPojo.setFirstName(requestPojo.getFirstName());
            spPojo.setFirmName(requestPojo.getFirmName());
            spPojo.setMobileNo(requestPojo.getMobileNo());
            spPojo.setEmailId(requestPojo.getEmailId());
            spPojo.setAddress(requestPojo.getAddress());
            spPojo.setLocation(requestPojo.getLocation());
            spPojo.setCity(requestPojo.getCity());
            spPojo.setDescription(requestPojo.getDescription());
            spPojo.setServiceName(requestPojo.getServiceType()); // Ensure this isn't null
            spPojo.setIsActive(AppConstant.Y);

            boolean spInserted = providerDao.insertServiceProvider(spPojo);

            if (spInserted) {
                // 3. Create Login
                LoginPojo lPojo = new LoginPojo();
                lPojo.setUsername(requestPojo.getUserName());
                lPojo.setPassword(requestPojo.getPassword());
                lPojo.setRole(AppConstant.PROVIDER);
                lPojo.setIsActive(AppConstant.Y);
                lPojo.setLoginStatus(AppConstant.LOGOUT);
                lPojo.setFailedAttempts(0);

                boolean loginInserted = loginDao.insertLoginDetails(lPojo);

                if (loginInserted) {
                    response.setStatus(AppConstant.SUCCESS);
                    response.setMsg("Registered Successfully");
                    resMap.put("providerId", spPojo.getId());
                    response.setResponseMap(resMap);
                }
            }
        } catch (Exception ex) {
            // If an actual DB error happens, we want to know what it is
            response.setStatus(AppConstant.FAILED);
            response.setMsg("Database Error: " + ex.getMessage());
            System.err.println("Registration Error: " + ex.getMessage());
        }
        return response;
    }

    @Override
    public ResponsePojo serviceProviderUpdation(RequestPojo requestPojo) {
        ResponsePojo response = new ResponsePojo();
        try {
            ServiceProviderPojo spPojo = new ServiceProviderPojo();
            spPojo.setId(requestPojo.getId());
            spPojo.setServiceName(requestPojo.getServiceName() != null
                    ? requestPojo.getServiceName() : requestPojo.getServiceType());
            spPojo.setCity(requestPojo.getCity());
            spPojo.setLocation(requestPojo.getLocation());
            spPojo.setIsActive(AppConstant.Y);

            boolean updated = providerDao.updateServiceProvider(spPojo);
            if (updated) {
                response.setStatus(AppConstant.SUCCESS);
                response.setMsg("Provider updated successfully");
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
    public ResponsePojo getServiceProviderData(RequestPojo requestPojo) {
        return new ResponsePojo();
    }

    @Override
    public ResponsePojo getProvidersByService(String serviceName, String city) {
        ResponsePojo response = new ResponsePojo();
        Map<String, Object> resMap = new HashMap<>();
        try {
            List<ServiceProviderPojo> list;
            if (city != null && !city.isEmpty()) {
                list = providerDao.getProvidersByServiceAndCity(serviceName, city);
            } else {
                list = providerDao.getProvidersByService(serviceName);
            }

            if (list == null) list = new ArrayList<>();

            // Convert to map list for frontend
            List<Map<String, Object>> result = new ArrayList<>();
            for (ServiceProviderPojo sp : list) {
                Map<String, Object> m = new HashMap<>();
                m.put("id",          sp.getId());
                m.put("firstName",   sp.getFirstName());
                m.put("firmName",    sp.getFirmName());
                m.put("mobileNo",    sp.getMobileNo());
                m.put("emailId",     sp.getEmailId());
                m.put("city",        sp.getCity());
                m.put("location",    sp.getLocation());
                m.put("serviceName", sp.getServiceName());
                m.put("description", sp.getDescription());
                result.add(m);
            }

            resMap.put("data", result);
            response.setStatus(AppConstant.SUCCESS);
            response.setMsg("Providers fetched: " + result.size());
            response.setResponseMap(resMap);
        } catch (Exception ex) {
            response.setStatus(AppConstant.FAILED);
            response.setMsg("Error: " + ex.getMessage());
            System.out.println(ex.getMessage());
        }
        return response;
    }
}