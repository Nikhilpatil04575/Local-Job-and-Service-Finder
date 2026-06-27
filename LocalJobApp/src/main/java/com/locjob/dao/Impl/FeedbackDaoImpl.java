package com.locjob.dao.Impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.locjob.dao.FeedbackDao;
import com.locjob.entity.FeedBackPojo;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

@Repository
public class FeedbackDaoImpl implements FeedbackDao {

    @PersistenceContext
    EntityManager entityManager;

    @Override
    public boolean insertFeedback(FeedBackPojo feedBackPojo) throws Exception {
        boolean result = false;
        try {
            entityManager.persist(feedBackPojo);
            result = true;
        } catch (Exception ex) {
            System.err.println("insertFeedback error: " + ex.getMessage());
        }
        return result;
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<FeedBackPojo> getReviewsByProvider(Long providerId) throws Exception {
        List<FeedBackPojo> list = null;
        try {
            Query q = entityManager.createNamedQuery("GET_REVIEWS_BY_PROVIDER");
            q.setParameter("providerId", providerId);
            list = (List<FeedBackPojo>) q.getResultList();
        } catch (Exception ex) {
            System.err.println("getReviewsByProvider error: " + ex.getMessage());
        }
        return list;
    }

    @Override
    public Double getAvgRatingByProvider(Long providerId) throws Exception {
        Double avg = null;
        try {
            Query q = entityManager.createNamedQuery("GET_AVG_RATING_BY_PROVIDER");
            q.setParameter("providerId", providerId);
            Object result = q.getSingleResult();
            if (result != null) avg = ((Number) result).doubleValue();
        } catch (Exception ex) {
            System.err.println("getAvgRatingByProvider error: " + ex.getMessage());
        }
        return avg;
    }

    @Override
    public boolean reviewExistsForBooking(Long bookingId, Long userId) throws Exception {
        try {
            Query q = entityManager.createNamedQuery("CHECK_REVIEW_EXISTS");
            q.setParameter("bookingId", bookingId);
            q.setParameter("userId", userId);
            Long count = (Long) q.getSingleResult();
            return count != null && count > 0;
        } catch (Exception ex) {
            System.err.println("reviewExistsForBooking error: " + ex.getMessage());
            return false;
        }
    }
}
