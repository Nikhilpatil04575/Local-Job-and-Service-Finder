package com.locjob.service.Impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.locjob.dao.FeedbackDao;
import com.locjob.entity.FeedBackPojo;
import com.locjob.pojo.RequestPojo;
import com.locjob.pojo.ResponsePojo;
import com.locjob.service.FeedbackService;
import com.locjob.utility.AppConstant;

@Component
public class FeedbackServiceImpl implements FeedbackService {

    @Autowired
    FeedbackDao feedbackDao;

    // ── Submit a review ───────────────────────────────────────────────────────
    @Override
    @Transactional
    public ResponsePojo submitReview(RequestPojo requestPojo) {
        ResponsePojo response = new ResponsePojo();
        try {
            // Guard: prevent duplicate review for same booking
            boolean exists = feedbackDao.reviewExistsForBooking(
                    requestPojo.getBookingId(), requestPojo.getUserId());
            if (exists) {
                response.setStatus(AppConstant.FAILED);
                response.setMsg("You have already submitted a review for this booking.");
                return response;
            }

            // Validate rating range
            Integer rating = requestPojo.getRating();
            if (rating == null || rating < 1 || rating > 5) {
                response.setStatus(AppConstant.FAILED);
                response.setMsg("Rating must be between 1 and 5.");
                return response;
            }

            FeedBackPojo fb = new FeedBackPojo();
            fb.setBookingId(requestPojo.getBookingId());
            fb.setProviderId(requestPojo.getProviderId());
            fb.setUserId(requestPojo.getUserId());
            fb.setUserName(requestPojo.getUserName());
            fb.setProviderName(requestPojo.getProviderName());
            fb.setServiceName(requestPojo.getServiceName());
            fb.setRating(rating);
            fb.setComment(requestPojo.getComment());

            boolean inserted = feedbackDao.insertFeedback(fb);
            if (inserted) {
                response.setStatus(AppConstant.SUCCESS);
                response.setMsg("Thank you! Your review has been submitted.");
            } else {
                response.setStatus(AppConstant.FAILED);
                response.setMsg("Failed to submit review. Please try again.");
            }
        } catch (Exception ex) {
            response.setStatus(AppConstant.FAILED);
            response.setMsg("Error: " + ex.getMessage());
            System.err.println("submitReview error: " + ex.getMessage());
        }
        return response;
    }

    // ── Get all reviews for a provider ────────────────────────────────────────
    @Override
    public ResponsePojo getReviewsByProvider(RequestPojo requestPojo) {
        ResponsePojo response = new ResponsePojo();
        Map<String, Object> resMap = new HashMap<>();
        try {
            Long providerId = requestPojo.getProviderId();

            List<FeedBackPojo> reviews = feedbackDao.getReviewsByProvider(providerId);
            if (reviews == null) reviews = new ArrayList<>();

            Double avgRating = feedbackDao.getAvgRatingByProvider(providerId);

            List<Map<String, Object>> result = new ArrayList<>();
            for (FeedBackPojo fb : reviews) {
                Map<String, Object> m = new HashMap<>();
                m.put("id",           fb.getId());
                m.put("bookingId",    fb.getBookingId());
                m.put("userId",       fb.getUserId());
                m.put("userName",     fb.getUserName());
                m.put("providerName", fb.getProviderName());
                m.put("serviceName",  fb.getServiceName());
                m.put("rating",       fb.getRating());
                m.put("comment",      fb.getComment());
                m.put("createdDate",  fb.getCreatedDate() != null ? fb.getCreatedDate().toString() : "");
                result.add(m);
            }

            resMap.put("reviews",   result);
            resMap.put("avgRating", avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : null);
            resMap.put("count",     result.size());

            response.setStatus(AppConstant.SUCCESS);
            response.setMsg(result.size() + " review(s) found");
            response.setResponseMap(resMap);

        } catch (Exception ex) {
            response.setStatus(AppConstant.FAILED);
            response.setMsg("Error: " + ex.getMessage());
        }
        return response;
    }
}
