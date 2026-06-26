package com.locjob.dao.Impl;

import java.util.List;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.locjob.dao.ProviderDao;
import com.locjob.entity.ServiceProviderPojo;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

@Repository
public class ProviderDaoImpl implements ProviderDao {

    @PersistenceContext
    EntityManager entityManager;

    @Override
    public boolean insertServiceProvider(ServiceProviderPojo serviceProviderPojo) throws Exception {
        System.out.println("Inside insertServiceProvider");
        boolean response = false;
        try {
            entityManager.persist(serviceProviderPojo);
            response = true;
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }
        return response;
    }

    @Override
    public boolean updateServiceProvider(ServiceProviderPojo serviceProviderPojo) throws Exception {
        boolean response = false;
        try {
            entityManager.merge(serviceProviderPojo);
            response = true;
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }
        return response;
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<ServiceProviderPojo> getProvidersByService(String serviceName) throws Exception {
        List<ServiceProviderPojo> list = null;
        try {
            Query q = entityManager.createNamedQuery("SEARCH_PROVIDER");
            q.setParameter("serviceName", serviceName);
            list = (List<ServiceProviderPojo>) q.getResultList();
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }
        return list;
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<ServiceProviderPojo> getProvidersByServiceAndCity(String serviceName, String city) throws Exception {
        List<ServiceProviderPojo> list = null;
        try {
            Query q = entityManager.createNamedQuery("SEARCH_PROVIDER_BY_CITY");
            q.setParameter("serviceName", serviceName);
            q.setParameter("city", city);
            list = (List<ServiceProviderPojo>) q.getResultList();
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }
        return list;
    }
}