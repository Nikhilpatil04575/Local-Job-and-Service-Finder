package com.locjob.service;

import com.locjob.pojo.ResponsePojo;
import java.util.Map;

public interface AdminService {
    ResponsePojo getAllUsers();
    ResponsePojo getAllProviders();
    ResponsePojo getAllBookings();
    ResponsePojo getDashboardStats();
    ResponsePojo blockUser(Long userId);
    ResponsePojo unblockUser(Long userId);
    ResponsePojo blockProvider(Long providerId);
    ResponsePojo unblockProvider(Long providerId);
}
