package com.locjob.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.locjob.pojo.ResponsePojo;
import com.locjob.service.AdminService;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/stats")
    public ResponsePojo getDashboardStats() {
        return adminService.getDashboardStats();
    }

    @GetMapping("/users")
    public ResponsePojo getAllUsers() {
        return adminService.getAllUsers();
    }

    @GetMapping("/providers")
    public ResponsePojo getAllProviders() {
        return adminService.getAllProviders();
    }

    @GetMapping("/bookings")
    public ResponsePojo getAllBookings() {
        return adminService.getAllBookings();
    }

    @PostMapping("/users/{id}/block")
    public ResponsePojo blockUser(@PathVariable Long id) {
        return adminService.blockUser(id);
    }

    @PostMapping("/users/{id}/unblock")
    public ResponsePojo unblockUser(@PathVariable Long id) {
        return adminService.unblockUser(id);
    }

    @PostMapping("/providers/{id}/block")
    public ResponsePojo blockProvider(@PathVariable Long id) {
        return adminService.blockProvider(id);
    }

    @PostMapping("/providers/{id}/unblock")
    public ResponsePojo unblockProvider(@PathVariable Long id) {
        return adminService.unblockProvider(id);
    }
}
