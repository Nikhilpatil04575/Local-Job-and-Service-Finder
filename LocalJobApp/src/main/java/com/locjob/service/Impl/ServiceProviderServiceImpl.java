package com.locjob.service.Impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.locjob.dao.FeedbackDao;
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

    @Autowired
    FeedbackDao feedbackDao;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

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
            spPojo.setUserName(requestPojo.getUserName());
            spPojo.setServiceName(requestPojo.getServiceType()); // Ensure this isn't null
            spPojo.setVisitingCharge(requestPojo.getVisitingCharge());
            spPojo.setIsActive(AppConstant.Y);

            boolean spInserted = providerDao.insertServiceProvider(spPojo);

            if (spInserted) {
                // 3. Create Login
                LoginPojo lPojo = new LoginPojo();
                lPojo.setUsername(requestPojo.getUserName());
                // Hash the password before saving to the database
                lPojo.setPassword(passwordEncoder.encode(requestPojo.getPassword()));
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
            ServiceProviderPojo spPojo = providerDao.getProviderById(requestPojo.getId());
            if (spPojo == null) {
                response.setStatus(AppConstant.FAILED);
                response.setMsg("Provider not found");
                return response;
            }
            
            // Only update fields provided from frontend
            if (requestPojo.getServiceName() != null || requestPojo.getServiceType() != null) {
                spPojo.setServiceName(requestPojo.getServiceName() != null
                        ? requestPojo.getServiceName() : requestPojo.getServiceType());
            }
            if (requestPojo.getCity() != null) {
                spPojo.setCity(requestPojo.getCity());
            }
            if (requestPojo.getLocation() != null) {
                spPojo.setLocation(requestPojo.getLocation());
            }
            if (requestPojo.getVisitingCharge() != null) {
                spPojo.setVisitingCharge(requestPojo.getVisitingCharge());
            }
            if (requestPojo.getIsActive() != null) {
                spPojo.setIsActive(requestPojo.getIsActive()); // Expecting 'Y' or 'N'
            }

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
    public ResponsePojo getProvidersByService(String serviceName, String city, String location) {
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

            // Apply location filter if provided (case-insensitive contains)
            final String locFilter = (location != null && !location.trim().isEmpty())
                    ? location.trim().toLowerCase() : null;
            if (locFilter != null) {
                list = list.stream()
                        .filter(sp -> sp.getLocation() != null &&
                                sp.getLocation().toLowerCase().contains(locFilter))
                        .collect(java.util.stream.Collectors.toList());
            }

            // Build response list and inject avg rating from feedback table
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
                m.put("visitingCharge", sp.getVisitingCharge());

                // Inject live avg rating
                try {
                    Double avg = feedbackDao.getAvgRatingByProvider(sp.getId());
                    m.put("rating",      avg != null ? Math.round(avg * 10.0) / 10.0 : null);
                    m.put("reviewCount", feedbackDao.getReviewsByProvider(sp.getId()).size());
                } catch (Exception e) {
                    m.put("rating",      null);
                    m.put("reviewCount", 0);
                }

                result.add(m);
            }

            // Sort: providers with ratings first (desc), then unrated
            result.sort((a, b) -> {
                Double rA = (Double) a.get("rating");
                Double rB = (Double) b.get("rating");
                if (rA == null && rB == null) return 0;
                if (rA == null) return 1;
                if (rB == null) return -1;
                return Double.compare(rB, rA);
            });

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