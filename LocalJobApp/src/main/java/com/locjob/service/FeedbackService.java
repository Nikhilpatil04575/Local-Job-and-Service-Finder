package com.locjob.service;

import com.locjob.pojo.RequestPojo;
import com.locjob.pojo.ResponsePojo;

public interface FeedbackService {

    public ResponsePojo submitReview(RequestPojo requestPojo);

    public ResponsePojo getReviewsByProvider(RequestPojo requestPojo);
}
