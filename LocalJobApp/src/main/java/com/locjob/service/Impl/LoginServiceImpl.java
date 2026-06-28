package com.locjob.service.Impl;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.locjob.dao.LoginDao;
import com.locjob.dao.ProviderDao;
import com.locjob.dao.ServiceUserDao;
import com.locjob.entity.LoginPojo;
import com.locjob.entity.ServiceProviderPojo;
import com.locjob.entity.ServiceUserPojo;
import com.locjob.pojo.RequestPojo;
import com.locjob.pojo.ResponsePojo;
import com.locjob.service.LoginService;
import com.locjob.utility.AppConstant;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Component
public class LoginServiceImpl implements LoginService {

    @Autowired
    LoginDao loginDao;

    @Autowired
    ServiceUserDao serviceUserDao;

    @Autowired
    ProviderDao providerDao;

    @PersistenceContext
    EntityManager entityManager;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public ResponsePojo loginUser(RequestPojo requestPojo) {
        ResponsePojo resPojo = new ResponsePojo();
        Map<String, Object> resMap = new HashMap<>();

        try {
            // 1. Validate credentials against LOGIN_TAB
            LoginPojo lg = loginDao.loginUser(
                requestPojo.getUserName(),
                requestPojo.getPassword(),
                requestPojo.getRole()
            );

            if (lg != null
                    && passwordEncoder.matches(requestPojo.getPassword(), lg.getPassword())
                    && lg.getRole().equals(requestPojo.getRole())) {

                resPojo.setStatus(AppConstant.SUCCESS);
                resPojo.setMsg("Login Successful");

                resMap.put("userName", lg.getUsername());
                resMap.put("role", lg.getRole());

                if (AppConstant.USER.equals(lg.getRole())) {

                    // FIX: Query SERVICE_USER_TAB by userName to get the correct business ID.
                    // We use a direct JPQL query so there is no ambiguity with the password param.
                    List<ServiceUserPojo> users = entityManager.createQuery(
                        "SELECT u FROM ServiceUserPojo u WHERE u.userName = :uname AND u.isActive = 'Y'",
                        ServiceUserPojo.class)
                        .setParameter("uname", lg.getUsername())
                        .getResultList();

                    if (!users.isEmpty()) {
                        Long correctUserId = users.get(0).getId();
                        resMap.put("userId", correctUserId);
                        System.out.println("LOGIN SUCCESS: userName=" + lg.getUsername()
                            + " | LOGIN_TAB.USER_ID=" + lg.getUserId()
                            + " | SERVICE_USER_TAB.ID=" + correctUserId);
                    } else {
                        // Profile row not found — log it clearly
                        System.err.println("LOGIN WARNING: No SERVICE_USER_TAB row found for userName="
                            + lg.getUsername() + ". userId will be missing from response.");
                    }

                } else if (AppConstant.PROVIDER.equals(lg.getRole())) {

                    // For providers, match by userName stored in LOGIN_TAB against
                    // the userName column that was saved during SP registration.
                    // The SP registration saves userName into LOGIN_TAB; the provider
                    // profile is in SERVICE_PROVIDER_TAB. We match by the login username
                    // against provider's emailId OR firstName (same approach as before),
                    // but prefer matching by a dedicated userName column if it exists.
                    // 
                    // Current schema has no userName column on SERVICE_PROVIDER_TAB,
                    // so we join via LOGIN_TAB userId == SERVICE_PROVIDER_TAB id is wrong.
                    // Best available match: look up by the username used at registration
                    // which was stored as emailId in some cases, or just use the LOGIN_TAB
                    // primary key mapped to the provider inserted in the same transaction.
                    //
                    // Safest query: find the provider whose row was created with the same
                    // userName by checking email_id OR firm_name OR provider_name.
                    List<ServiceProviderPojo> providers = entityManager.createQuery(
                        "SELECT p FROM ServiceProviderPojo p WHERE p.isActive = 'Y' AND ("
                        + "p.emailId = :uname OR p.firstName = :uname OR p.firmName = :uname)",
                        ServiceProviderPojo.class)
                        .setParameter("uname", lg.getUsername())
                        .getResultList();

                    if (!providers.isEmpty()) {
                        Long correctProviderId = providers.get(0).getId();
                        resMap.put("providerId", correctProviderId);
                        System.out.println("LOGIN SUCCESS: userName=" + lg.getUsername()
                            + " | LOGIN_TAB.USER_ID=" + lg.getUserId()
                            + " | SERVICE_PROVIDER_TAB.ID=" + correctProviderId);
                    } else {
                        System.err.println("LOGIN WARNING: No SERVICE_PROVIDER_TAB row found for userName="
                            + lg.getUsername() + ". providerId will be missing from response.");
                    }
                }

                resPojo.setResponseMap(resMap);

                // Update last login time
                lg.setLastLoginTime(LocalDateTime.now());
                loginDao.updateLoginDetails(lg);

            } else {
                resPojo.setStatus(AppConstant.FAILED);
                resPojo.setMsg("Invalid Credentials");
            }

        } catch (Exception ex) {
            resPojo.setStatus(AppConstant.FAILED);
            resPojo.setMsg("Error: " + ex.getMessage());
            System.err.println("LOGIN ERROR: " + ex.getMessage());
            ex.printStackTrace();
        }

        return resPojo;
    }

    @Override
    @Transactional
    public ResponsePojo logoutUser(RequestPojo requestPojo) {
        ResponsePojo resPojo = new ResponsePojo();
        try {
            LoginPojo lg = loginDao.logoutUser(requestPojo.getUserName());
            if (lg != null) {
                resPojo.setStatus(AppConstant.SUCCESS);
                lg.setLastLogoutTime(LocalDateTime.now());
                lg.setLoginStatus(AppConstant.LOGOUT);
                loginDao.updateLoginDetails(lg);
            }
        } catch (Exception ex) {
            resPojo.setStatus(AppConstant.FAILED);
        }
        return resPojo;
    }
}