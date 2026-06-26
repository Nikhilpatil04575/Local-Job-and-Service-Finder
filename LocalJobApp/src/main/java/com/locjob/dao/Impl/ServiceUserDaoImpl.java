package com.locjob.dao.Impl;

import java.util.List;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.locjob.dao.ServiceUserDao;
import com.locjob.entity.ServiceUserPojo;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

@Repository
public class ServiceUserDaoImpl implements ServiceUserDao {

    @PersistenceContext
    EntityManager entityManager;

    @Override
    @Transactional
    public boolean insertServiceUser(ServiceUserPojo serviceUserPojo) throws Exception {
        System.out.println("Inside insertServiceUser");
        boolean response = false;
        try {
            entityManager.persist(serviceUserPojo);
            response = true;
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }
        return response;
    }

    @Override
    @Transactional
    public boolean updateServiceUser(ServiceUserPojo serviceUserPojo) throws Exception {
        System.out.println("Inside updateServiceUser");
        boolean response = false;
        try {
            entityManager.merge(serviceUserPojo);
            response = true;
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }
        return response;
    }

    @Override
    @SuppressWarnings("unchecked")
    public ServiceUserPojo getServiceUser(String userName, String password) throws Exception {
        ServiceUserPojo lp = null;
        try {
            Query sql = entityManager.createQuery(
                "select su from ServiceUserPojo su where su.userName = :userName and su.isActive = 'Y'"
            );
            sql.setParameter("userName", userName);
            List<ServiceUserPojo> lpList = (List<ServiceUserPojo>) sql.getResultList();
            if (null != lpList && !lpList.isEmpty()) {
                lp = lpList.get(0);
            }
        } catch (Exception ex) {
            System.out.println(ex);
        }
        return lp; // FIX: was returning null before
    }
}