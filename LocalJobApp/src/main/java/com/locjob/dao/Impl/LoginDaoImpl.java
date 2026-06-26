package com.locjob.dao.Impl;

import java.util.List;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.locjob.dao.LoginDao;
import com.locjob.entity.LoginPojo;
import com.locjob.utility.AppConstant;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

@Repository
public class LoginDaoImpl implements LoginDao {

    @PersistenceContext
    EntityManager entityManager;

    @Override
    @Transactional
    public boolean insertLoginDetails(LoginPojo loginPojo) throws Exception {
        System.out.println("Inside insertLoginDetails");
        boolean response = false;
        try {
            entityManager.persist(loginPojo);
            response = true;
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }
        return response;
    }

    @SuppressWarnings("unchecked")
    @Override
    public LoginPojo loginUser(String userName, String password, String role) throws Exception {
        LoginPojo lp = null;
        try {
            Query sql = entityManager.createNamedQuery(AppConstant.SEARCH_USER);
            sql.setParameter("userName", userName);
            List<LoginPojo> lpList = (List<LoginPojo>) sql.getResultList();
            if (null != lpList && !lpList.isEmpty()) {
                lp = lpList.get(0);
            }
        } catch (Exception ex) {
            System.out.println(ex);
        }
        return lp;
    }

    @SuppressWarnings("unchecked")
    @Override
    public LoginPojo logoutUser(String userName) throws Exception {
        LoginPojo lp = null;
        try {
            Query sql = entityManager.createNamedQuery(AppConstant.SEARCH_USER);
            sql.setParameter("userName", userName);
            List<LoginPojo> lpList = (List<LoginPojo>) sql.getResultList();
            if (null != lpList && !lpList.isEmpty()) {
                lp = lpList.get(0);
            }
        } catch (Exception ex) {
            System.out.println(ex);
        }
        return lp;
    }

    @Override
    @Transactional
    public boolean updateLoginDetails(LoginPojo loginPojo) throws Exception {
        System.out.println("Inside updateLoginDetails");
        boolean response = false;
        try {
            entityManager.merge(loginPojo);
            response = true;
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }
        return response;
    }
}