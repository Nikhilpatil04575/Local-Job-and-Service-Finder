package com.locjob.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import jakarta.persistence.*;

@Entity
@Table(name = "service_list_tab")
public class ServiceListPojo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "SERVICE_NAME", nullable = false, length = 100)
    private String serviceName;

    @Column(name = "SERVICE_DESC", length = 255)
    private String serviceDesc;

    // No-arg constructor
    public ServiceListPojo() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getServiceDesc() {
        return serviceDesc;
    }

    public void setServiceDesc(String serviceDesc) {
        this.serviceDesc = serviceDesc;
    }
}
