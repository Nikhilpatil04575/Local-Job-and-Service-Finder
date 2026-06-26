package com.locjob.pojo;

public class RequestPojo {

    // Common fields
    private Long   id;
    private String firstName;
    private String lastName;
    private String mobileNo;
    private String emailId;
    private String address;
    private String location;
    private String city;
    private String userName;
    private String password;
    private String isActive;
    private String role;

    // SP fields
    private String firmName;
    private String serviceName;
    private String serviceType;   // frontend sends serviceType, backend maps to serviceName
    private String description;

    // Booking fields
    private Long   bookingId;
    private Long   providerId;
    private Long   userId;
    private String providerName;
    private String bookingStatus;
    private String serviceCharge;
    
    private String providerEmail;
    private String customerName;

    // Getters and Setters
    
    public String getProviderEmail() {
        return providerEmail;
    }

    public void setProviderEmail(String providerEmail) {
        this.providerEmail = providerEmail;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getMobileNo() { return mobileNo; }
    public void setMobileNo(String mobileNo) { this.mobileNo = mobileNo; }

    public String getEmailId() { return emailId; }
    public void setEmailId(String emailId) { this.emailId = emailId; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getIsActive() { return isActive; }
    public void setIsActive(String isActive) { this.isActive = isActive; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getFirmName() { return firmName; }
    public void setFirmName(String firmName) { this.firmName = firmName; }

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }

    public String getServiceType() { return serviceType; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public Long getProviderId() { return providerId; }
    public void setProviderId(Long providerId) { this.providerId = providerId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }

    public String getBookingStatus() { return bookingStatus; }
    public void setBookingStatus(String bookingStatus) { this.bookingStatus = bookingStatus; }

    public String getServiceCharge() { return serviceCharge; }
    public void setServiceCharge(String serviceCharge) { this.serviceCharge = serviceCharge; }

    @Override
    public String toString() {
        return "RequestPojo [id=" + id + ", firstName=" + firstName + ", lastName=" + lastName
                + ", mobileNo=" + mobileNo + ", emailId=" + emailId + ", address=" + address
                + ", location=" + location + ", city=" + city + ", userName=" + userName
                + ", role=" + role + ", firmName=" + firmName + ", serviceName=" + serviceName
                + ", serviceType=" + serviceType + ", bookingId=" + bookingId
                + ", providerId=" + providerId + ", userId=" + userId + "]";
    }
}