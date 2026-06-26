//package com.locjob.entity;
//
//import java.time.LocalDateTime;
//
//import jakarta.persistence.Column;
//import jakarta.persistence.Entity;
//import jakarta.persistence.GeneratedValue;
//import jakarta.persistence.GenerationType;
//import jakarta.persistence.Id;
//import jakarta.persistence.NamedQueries;
//import jakarta.persistence.NamedQuery;
//import jakarta.persistence.PrePersist;
//import jakarta.persistence.PreUpdate;
//import jakarta.persistence.Table;
//
//@NamedQueries({
//    @NamedQuery(
//        name = "GET_BOOKINGS_BY_USER",
//        query = "select sb from ServiceBookingPojo sb where sb.userId = :userId and sb.isActive = 'Y' order by sb.createdDate desc"
//    ),
//    @NamedQuery(
//        name = "GET_BOOKINGS_BY_PROVIDER",
//        query = "select sb from ServiceBookingPojo sb where sb.providerId = :providerId and sb.isActive = 'Y' order by sb.createdDate desc"
//    ),
//    @NamedQuery(
//        name = "GET_BOOKING_BY_ID",
//        query = "select sb from ServiceBookingPojo sb where sb.id = :id and sb.isActive = 'Y'"
//    )
//})
//@Entity
//@Table(name = "SERVICE_BOOKING_TAB")
//public class ServiceBookingPojo {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "ID")
//    private Long id;
//
//    @Column(name = "PROVIDER_ID", nullable = false)
//    private Long providerId;
//
//    @Column(name = "USER_ID", nullable = false)
//    private Long userId;
//
//    @Column(name = "USER_NAME", length = 50)
//    private String userName;
//
//    @Column(name = "PROVIDER_NAME", length = 100)
//    private String providerName;
//
//    @Column(name = "SERVICE_NAME", nullable = false, length = 100)
//    private String serviceName;
//
//    @Column(name = "SERVICE_DESCRIPTION", length = 255)
//    private String serviceDescription;
//
//    @Column(name = "SERVICE_ADDRESS", length = 255)
//    private String serviceAddress;
//
//    @Column(name = "SERVICE_CITY", length = 100)
//    private String serviceCity;
//
//    @Column(name = "SERVICE_LOCATION", length = 100)
//    private String serviceLocation;
//
//    // PENDING / CONFIRMED / REJECTED / COMPLETED / CANCELLED
//    @Column(name = "BOOKING_STATUS", length = 20)
//    private String bookingStatus;
//
//    @Column(name = "SERVICE_CHARGE", length = 20)
//    private String serviceCharge;
//
//    @Column(name = "IS_ACTIVE")
//    private String isActive;
//
//    @Column(name = "BOOK_DATE")
//    private LocalDateTime bookDate;
//
//    @Column(name = "CONFIRM_DATE")
//    private LocalDateTime confirmDate;
//
//    @Column(name = "COMPLETE_DATE")
//    private LocalDateTime completeDate;
//
//    @Column(name = "CREATED_DATE", updatable = false)
//    private LocalDateTime createdDate;
//
//    @Column(name = "UPDATED_DATE")
//    private LocalDateTime updatedDate;
//
//    public ServiceBookingPojo() {}
//
//    @PrePersist
//    protected void onCreate() {
//        createdDate = LocalDateTime.now();
//        updatedDate = LocalDateTime.now();
//    }
//
//    @PreUpdate
//    protected void onUpdate() {
//        updatedDate = LocalDateTime.now();
//    }
//
//    // Getters and Setters
//    public Long getId() { return id; }
//    public void setId(Long id) { this.id = id; }
//
//    public Long getProviderId() { return providerId; }
//    public void setProviderId(Long providerId) { this.providerId = providerId; }
//
//    public Long getUserId() { return userId; }
//    public void setUserId(Long userId) { this.userId = userId; }
//
//    public String getUserName() { return userName; }
//    public void setUserName(String userName) { this.userName = userName; }
//
//    public String getProviderName() { return providerName; }
//    public void setProviderName(String providerName) { this.providerName = providerName; }
//
//    public String getServiceName() { return serviceName; }
//    public void setServiceName(String serviceName) { this.serviceName = serviceName; }
//
//    public String getServiceDescription() { return serviceDescription; }
//    public void setServiceDescription(String serviceDescription) { this.serviceDescription = serviceDescription; }
//
//    public String getServiceAddress() { return serviceAddress; }
//    public void setServiceAddress(String serviceAddress) { this.serviceAddress = serviceAddress; }
//
//    public String getServiceCity() { return serviceCity; }
//    public void setServiceCity(String serviceCity) { this.serviceCity = serviceCity; }
//
//    public String getServiceLocation() { return serviceLocation; }
//    public void setServiceLocation(String serviceLocation) { this.serviceLocation = serviceLocation; }
//
//    public String getBookingStatus() { return bookingStatus; }
//    public void setBookingStatus(String bookingStatus) { this.bookingStatus = bookingStatus; }
//
//    public String getServiceCharge() { return serviceCharge; }
//    public void setServiceCharge(String serviceCharge) { this.serviceCharge = serviceCharge; }
//
//    public String getIsActive() { return isActive; }
//    public void setIsActive(String isActive) { this.isActive = isActive; }
//
//    public LocalDateTime getBookDate() { return bookDate; }
//    public void setBookDate(LocalDateTime bookDate) { this.bookDate = bookDate; }
//
//    public LocalDateTime getConfirmDate() { return confirmDate; }
//    public void setConfirmDate(LocalDateTime confirmDate) { this.confirmDate = confirmDate; }
//
//    public LocalDateTime getCompleteDate() { return completeDate; }
//    public void setCompleteDate(LocalDateTime completeDate) { this.completeDate = completeDate; }
//
//    public LocalDateTime getCreatedDate() { return createdDate; }
//    public LocalDateTime getUpdatedDate() { return updatedDate; }
//
//    @Override
//    public String toString() {
//        return "ServiceBookingPojo [id=" + id + ", providerId=" + providerId + ", userId=" + userId
//                + ", serviceName=" + serviceName + ", bookingStatus=" + bookingStatus
//                + ", serviceCity=" + serviceCity + ", createdDate=" + createdDate + "]";
//    }
//}

package com.locjob.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@NamedQueries({
    @NamedQuery(
        name = "GET_BOOKINGS_BY_USER",
        query = "select b from ServiceBookingPojo b where b.userId = :userId order by b.createdDate desc"
    ),
    @NamedQuery(
        name = "GET_BOOKINGS_BY_PROVIDER",
        query = "select b from ServiceBookingPojo b where b.providerId = :providerId order by b.createdDate desc"
    ),
    @NamedQuery(
        name = "GET_BOOKING_BY_ID",
        query = "select b from ServiceBookingPojo b where b.id = :id"
    )
})
@Entity
@Table(name = "service_booking_tab")
public class ServiceBookingPojo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "PROVIDER_ID")
    private Long providerId;

    @Column(name = "USER_ID")
    private Long userId;

    @Column(name = "USER_NAME", length = 100)
    private String userName;

    @Column(name = "PROVIDER_NAME", length = 100)
    private String providerName;

    @Column(name = "SERVICE_NAME", length = 100)
    private String serviceName;

    @Column(name = "DESCRIPTION", length = 500)
    private String description;

    @Column(name = "ADDRESS", length = 255)
    private String address;

    @Column(name = "CITY", length = 50)
    private String city;

    @Column(name = "LOCATION", length = 100)
    private String location;

    @Column(name = "BOOKING_STATUS", length = 20)
    private String bookingStatus;

    @Column(name = "SERVICE_CHARGE", length = 20)
    private String serviceCharge;

    @Column(name = "IS_ACTIVE")
    private String isActive;

    @Column(name = "CREATED_DATE", updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "UPDATED_DATE")
    private LocalDateTime updatedDate;

    @Column(name = "CONFIRMED_DATE")
    private LocalDateTime confirmedDate;

    @Column(name = "COMPLETED_DATE")
    private LocalDateTime completedDate;

    public ServiceBookingPojo() {}

    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
        updatedDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedDate = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProviderId() { return providerId; }
    public void setProviderId(Long providerId) { this.providerId = providerId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getBookingStatus() { return bookingStatus; }
    public void setBookingStatus(String bookingStatus) { this.bookingStatus = bookingStatus; }

    public String getServiceCharge() { return serviceCharge; }
    public void setServiceCharge(String serviceCharge) { this.serviceCharge = serviceCharge; }

    public String getIsActive() { return isActive; }
    public void setIsActive(String isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }

    public LocalDateTime getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(LocalDateTime updatedDate) { this.updatedDate = updatedDate; }

    public LocalDateTime getConfirmedDate() { return confirmedDate; }
    public void setConfirmedDate(LocalDateTime confirmedDate) { this.confirmedDate = confirmedDate; }

    public LocalDateTime getCompletedDate() { return completedDate; }
    public void setCompletedDate(LocalDateTime completedDate) { this.completedDate = completedDate; }
}