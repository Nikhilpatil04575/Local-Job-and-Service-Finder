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
//		@NamedQuery(name = "SEARCH_PROVIDER", query = "select lt from ServiceProviderPojo lt where lt.serviceName= :serviceName and lt.isActive='Y'") })
//@Entity
//@Table(name = "SERVICE_PROVIDER_TAB")
//public class ServiceProviderPojo {
//	@Id
//	@GeneratedValue(strategy = GenerationType.IDENTITY)
//	@Column(name = "ID")
//	private Long id;
//
//	@Column(name = "PROVIDER_NAME", nullable = false, length = 50)
//	private String firstName;
//
//	@Column(name = "FIRM_NAME", length = 50)
//	private String firmName;
//
//	@Column(name = "MOBILE_NO", length = 15)
//	private String mobileNo;
//
//	@Column(name = "EMAIL_ID", length = 100)
//	private String emailId;
//
//	@Column(name = "ADDRESS", length = 255)
//	private String address;
//
//	@Column(name = "LOCATION", length = 100)
//	private String location;
//
//	@Column(name = "CITY", length = 100)
//	private String city;
//
//	@Column(name = "SERVICE_NAME", length = 100)
//	private String serviceName;
//
//	@Column(name = "DESCRIPTION", length = 100)
//	private String description;
//
//	@Column(name = "IS_ACTIVE")
//	private String isActive;
//
//	@Column(name = "CREATED_DATE", updatable = false)
//	private LocalDateTime createdDate;
//
//	@Column(name = "UPDATED_DATE")
//	private LocalDateTime updatedDate;
//
//	public ServiceProviderPojo() {
//
//	}
//
//	@PrePersist
//	protected void onCreate() {
//		createdDate = LocalDateTime.now();
//		updatedDate = LocalDateTime.now();
//	}
//
//	@PreUpdate
//	protected void onUpdate() {
//		updatedDate = LocalDateTime.now();
//	}
//
//	public Long getId() {
//		return id;
//	}
//
//	public void setId(Long id) {
//		this.id = id;
//	}
//
//	public String getFirstName() {
//		return firstName;
//	}
//
//	public void setFirstName(String firstName) {
//		this.firstName = firstName;
//	}
//
//	public String getFirmName() {
//		return firmName;
//	}
//
//	public void setFirmName(String firmName) {
//		this.firmName = firmName;
//	}
//
//	public String getMobileNo() {
//		return mobileNo;
//	}
//
//	public void setMobileNo(String mobileNo) {
//		this.mobileNo = mobileNo;
//	}
//
//	public String getEmailId() {
//		return emailId;
//	}
//
//	public void setEmailId(String emailId) {
//		this.emailId = emailId;
//	}
//
//	public String getAddress() {
//		return address;
//	}
//
//	public void setAddress(String address) {
//		this.address = address;
//	}
//
//	public String getLocation() {
//		return location;
//	}
//
//	public void setLocation(String location) {
//		this.location = location;
//	}
//
//	public String getCity() {
//		return city;
//	}
//
//	public void setCity(String city) {
//		this.city = city;
//	}
//
//	public String getServiceName() {
//		return serviceName;
//	}
//
//	public void setServiceName(String serviceName) {
//		this.serviceName = serviceName;
//	}
//
//	public String getDescription() {
//		return description;
//	}
//
//	public void setDescription(String description) {
//		this.description = description;
//	}
//
//	public String getIsActive() {
//		return isActive;
//	}
//
//	public void setIsActive(String isActive) {
//		this.isActive = isActive;
//	}
//
//	public LocalDateTime getCreatedDate() {
//		return createdDate;
//	}
//
//	public void setCreatedDate(LocalDateTime createdDate) {
//		this.createdDate = createdDate;
//	}
//
//	public LocalDateTime getUpdatedDate() {
//		return updatedDate;
//	}
//
//	public void setUpdatedDate(LocalDateTime updatedDate) {
//		this.updatedDate = updatedDate;
//	}
//
//	@Override
//	public String toString() {
//		return "ServiceProviderPojo [id=" + id + ", firstName=" + firstName + ", firmName=" + firmName + ", mobileNo="
//				+ mobileNo + ", emailId=" + emailId + ", address=" + address + ", location=" + location + ", city="
//				+ city + ", serviceName=" + serviceName + ", description=" + description + ", isActive=" + isActive
//				+ ", createdDate=" + createdDate + ", updatedDate=" + updatedDate + "]";
//	}
//
//}


package com.locjob.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@NamedQueries({
    @NamedQuery(
        name = "SEARCH_PROVIDER",
        query = "select sp from ServiceProviderPojo sp where sp.serviceName = :serviceName and sp.isActive = 'Y'"
    ),
    @NamedQuery(
        name = "SEARCH_PROVIDER_BY_CITY",
        query = "select sp from ServiceProviderPojo sp where sp.serviceName = :serviceName and sp.city = :city and sp.isActive = 'Y'"
    )
})
@Entity
@Table(name = "service_provider_tab")
public class ServiceProviderPojo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "PROVIDER_NAME", length = 100)
    private String firstName;

    @Column(name = "FIRM_NAME", length = 150)
    private String firmName;

    @Column(name = "MOBILE_NO", length = 15)
    private String mobileNo;

    @Column(name = "EMAIL_ID", length = 100)
    private String emailId;

    @Column(name = "ADDRESS", length = 255)
    private String address;

    @Column(name = "LOCATION", length = 100)
    private String location;

    @Column(name = "CITY", length = 50)
    private String city;

    @Column(name = "SERVICE_NAME", length = 100)
    private String serviceName;

    @Column(name = "DESCRIPTION", length = 500)
    private String description;

    @Column(name = "IS_ACTIVE")
    private String isActive;

    @Column(name = "CREATED_TIME", updatable = false)
    private LocalDateTime createdTime;

    @Column(name = "UPDATED_TIME")
    private LocalDateTime updatedTime;

    public ServiceProviderPojo() {}

    @PrePersist
    protected void onCreate() {
        createdTime = LocalDateTime.now();
        updatedTime = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedTime = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getFirmName() { return firmName; }
    public void setFirmName(String firmName) { this.firmName = firmName; }

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

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIsActive() { return isActive; }
    public void setIsActive(String isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedTime() { return createdTime; }
    public void setCreatedTime(LocalDateTime createdTime) { this.createdTime = createdTime; }

    public LocalDateTime getUpdatedTime() { return updatedTime; }
    public void setUpdatedTime(LocalDateTime updatedTime) { this.updatedTime = updatedTime; }
}