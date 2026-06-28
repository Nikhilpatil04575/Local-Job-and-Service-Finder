package com.locjob.dao.Impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.locjob.dao.AdminDao;
import com.locjob.entity.ServiceUserPojo;
import com.locjob.entity.ServiceProviderPojo;
import com.locjob.entity.ServiceBookingPojo;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

@Repository
@Transactional
public class AdminDaoImpl implements AdminDao {

    @PersistenceContext
    EntityManager entityManager;

    @Override
    @SuppressWarnings("unchecked")
    public List<ServiceUserPojo> getAllUsers() throws Exception {
        return entityManager.createQuery("SELECT u FROM ServiceUserPojo u", ServiceUserPojo.class).getResultList();
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<ServiceProviderPojo> getAllProviders() throws Exception {
        return entityManager.createQuery("SELECT p FROM ServiceProviderPojo p", ServiceProviderPojo.class).getResultList();
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<ServiceBookingPojo> getAllBookings() throws Exception {
        return entityManager.createQuery("SELECT b FROM ServiceBookingPojo b", ServiceBookingPojo.class).getResultList();
    }

    @Override
    public Map<String, Long> getDashboardStats() throws Exception {
        Map<String, Long> stats = new HashMap<>();
        
        Long totalUsers = (Long) entityManager.createQuery("SELECT COUNT(u) FROM ServiceUserPojo u").getSingleResult();
        Long totalProviders = (Long) entityManager.createQuery("SELECT COUNT(p) FROM ServiceProviderPojo p").getSingleResult();
        Long totalBookings = (Long) entityManager.createQuery("SELECT COUNT(b) FROM ServiceBookingPojo b").getSingleResult();
        
        stats.put("totalUsers", totalUsers);
        stats.put("totalProviders", totalProviders);
        stats.put("totalBookings", totalBookings);
        
        return stats;
    }

    @Override
    public boolean blockUser(Long userId) throws Exception {
        ServiceUserPojo user = entityManager.find(ServiceUserPojo.class, userId);
        if (user != null) {
            user.setIsActive("N"); // Assuming N means blocked
            entityManager.merge(user);
            
            // Block the corresponding Login record
            entityManager.createQuery("UPDATE LoginPojo l SET l.isActive = 'N' WHERE l.role = 'USER' AND l.username = :uname")
                         .setParameter("uname", user.getUserName())
                         .executeUpdate();
            return true;
        }
        return false;
    }

    @Override
    public boolean unblockUser(Long userId) throws Exception {
        ServiceUserPojo user = entityManager.find(ServiceUserPojo.class, userId);
        if (user != null) {
            user.setIsActive("Y");
            entityManager.merge(user);
            
            // Unblock the corresponding Login record
            entityManager.createQuery("UPDATE LoginPojo l SET l.isActive = 'Y' WHERE l.role = 'USER' AND l.username = :uname")
                         .setParameter("uname", user.getUserName())
                         .executeUpdate();
            return true;
        }
        return false;
    }

    @Override
    public boolean blockProvider(Long providerId) throws Exception {
        ServiceProviderPojo provider = entityManager.find(ServiceProviderPojo.class, providerId);
        if (provider != null) {
            provider.setIsActive("N");
            entityManager.merge(provider);
            
            // Block the corresponding Login record
            entityManager.createQuery("UPDATE LoginPojo l SET l.isActive = 'N' WHERE l.role = 'PROVIDER' AND (l.username = :email OR l.username = :name)")
                         .setParameter("email", provider.getEmailId())
                         .setParameter("name", provider.getFirstName())
                         .executeUpdate();
            return true;
        }
        return false;
    }

    @Override
    public boolean unblockProvider(Long providerId) throws Exception {
        ServiceProviderPojo provider = entityManager.find(ServiceProviderPojo.class, providerId);
        if (provider != null) {
            provider.setIsActive("Y");
            entityManager.merge(provider);
            
            // Unblock the corresponding Login record
            entityManager.createQuery("UPDATE LoginPojo l SET l.isActive = 'Y' WHERE l.role = 'PROVIDER' AND (l.username = :email OR l.username = :name)")
                         .setParameter("email", provider.getEmailId())
                         .setParameter("name", provider.getFirstName())
                         .executeUpdate();
            return true;
        }
        return false;
    }
}
