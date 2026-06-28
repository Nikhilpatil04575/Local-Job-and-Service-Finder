package com.locjob.dao;

import com.locjob.entity.ServiceUserPojo;
import com.locjob.entity.ServiceProviderPojo;
import com.locjob.entity.ServiceBookingPojo;
import java.util.List;
import java.util.Map;

public interface AdminDao {
    List<ServiceUserPojo> getAllUsers() throws Exception;
    List<ServiceProviderPojo> getAllProviders() throws Exception;
    List<ServiceBookingPojo> getAllBookings() throws Exception;
    Map<String, Long> getDashboardStats() throws Exception;
    boolean blockUser(Long userId) throws Exception;
    boolean unblockUser(Long userId) throws Exception;
    boolean blockProvider(Long providerId) throws Exception;
    boolean unblockProvider(Long providerId) throws Exception;
}
