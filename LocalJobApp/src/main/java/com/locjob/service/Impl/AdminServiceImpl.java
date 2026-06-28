package com.locjob.service.Impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.locjob.dao.AdminDao;
import com.locjob.entity.ServiceUserPojo;
import com.locjob.entity.ServiceProviderPojo;
import com.locjob.entity.ServiceBookingPojo;
import com.locjob.pojo.ResponsePojo;
import com.locjob.service.AdminService;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminDao adminDao;

    @Override
    public ResponsePojo getAllUsers() {
        ResponsePojo response = new ResponsePojo();
        try {
            List<ServiceUserPojo> users = adminDao.getAllUsers();
            response.setObj(users);
            response.setMsg("Users fetched successfully");
        } catch (Exception e) {
            response.setMsg("Failed to fetch users");
            e.printStackTrace();
        }
        return response;
    }

    @Override
    public ResponsePojo getAllProviders() {
        ResponsePojo response = new ResponsePojo();
        try {
            List<ServiceProviderPojo> providers = adminDao.getAllProviders();
            response.setObj(providers);
            response.setMsg("Providers fetched successfully");
        } catch (Exception e) {
            response.setMsg("Failed to fetch providers");
            e.printStackTrace();
        }
        return response;
    }

    @Override
    public ResponsePojo getAllBookings() {
        ResponsePojo response = new ResponsePojo();
        try {
            List<ServiceBookingPojo> bookings = adminDao.getAllBookings();
            response.setObj(bookings);
            response.setMsg("Bookings fetched successfully");
        } catch (Exception e) {
            response.setMsg("Failed to fetch bookings");
            e.printStackTrace();
        }
        return response;
    }

    @Override
    public ResponsePojo getDashboardStats() {
        ResponsePojo response = new ResponsePojo();
        try {
            Map<String, Long> stats = adminDao.getDashboardStats();
            response.setObj(stats);
            response.setMsg("Stats fetched successfully");
        } catch (Exception e) {
            response.setMsg("Failed to fetch stats");
            e.printStackTrace();
        }
        return response;
    }

    @Override
    public ResponsePojo blockUser(Long userId) {
        ResponsePojo response = new ResponsePojo();
        try {
            boolean success = adminDao.blockUser(userId);
            response.setMsg(success ? "User blocked successfully" : "User not found");
        } catch (Exception e) {
            response.setMsg("Failed to block user");
            e.printStackTrace();
        }
        return response;
    }

    @Override
    public ResponsePojo unblockUser(Long userId) {
        ResponsePojo response = new ResponsePojo();
        try {
            boolean success = adminDao.unblockUser(userId);
            response.setMsg(success ? "User unblocked successfully" : "User not found");
        } catch (Exception e) {
            response.setMsg("Failed to unblock user");
            e.printStackTrace();
        }
        return response;
    }

    @Override
    public ResponsePojo blockProvider(Long providerId) {
        ResponsePojo response = new ResponsePojo();
        try {
            boolean success = adminDao.blockProvider(providerId);
            response.setMsg(success ? "Provider blocked successfully" : "Provider not found");
        } catch (Exception e) {
            response.setMsg("Failed to block provider");
            e.printStackTrace();
        }
        return response;
    }

    @Override
    public ResponsePojo unblockProvider(Long providerId) {
        ResponsePojo response = new ResponsePojo();
        try {
            boolean success = adminDao.unblockProvider(providerId);
            response.setMsg(success ? "Provider unblocked successfully" : "Provider not found");
        } catch (Exception e) {
            response.setMsg("Failed to unblock provider");
            e.printStackTrace();
        }
        return response;
    }
}
