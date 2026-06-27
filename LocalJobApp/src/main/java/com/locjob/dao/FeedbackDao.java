package com.locjob.dao;

import java.util.List;
import com.locjob.entity.FeedBackPojo;

public interface FeedbackDao {

    public boolean insertFeedback(FeedBackPojo feedBackPojo) throws Exception;

    public List<FeedBackPojo> getReviewsByProvider(Long providerId) throws Exception;

    public Double getAvgRatingByProvider(Long providerId) throws Exception;

    public boolean reviewExistsForBooking(Long bookingId, Long userId) throws Exception;
}
