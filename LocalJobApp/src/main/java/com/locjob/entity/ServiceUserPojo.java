package com.locjob.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;


@Entity
@Table(name = "SERVICE_USER_TAB")
public class ServiceUserPojo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "FIRST_NAME", nullable = false, length = 50)
    private String firstName;

    @Column(name = "LAST_NAME",  nullable = false, length = 50)
    private String lastName;

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

    @Column(name = "USER_NAME", nullable = false, unique = true, length = 50)
    private String userName;

    @Column(name = "PASSWORD", nullable = false, length = 255)
    private String password;

    @Column(name = "IS_ACTIVE")
    private String isActive;
    
    @Column(name = "CREATED_TIME", updatable = false)
    private LocalDateTime createdTime;

    @Column(name = "UPDATED_TIME")
    private LocalDateTime updatedTime;

    /* Auto timestamp handling */
 // No-arg constructor
    public ServiceUserPojo() {
    }

    @PrePersist
    protected void onCreate() {
        createdTime = LocalDateTime.now();
        updatedTime = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedTime = LocalDateTime.now();
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getMobileNo() {
		return mobileNo;
	}

	public void setMobileNo(String mobileNo) {
		this.mobileNo = mobileNo;
	}

	public String getEmailId() {
		return emailId;
	}

	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	
	public String getIsActive() {
		return isActive;
	}

	public void setIsActive(String isActive) {
		this.isActive = isActive;
	}

	public LocalDateTime getCreatedTime() {
		return createdTime;
	}

	public void setCreatedTime(LocalDateTime createdTime) {
		this.createdTime = createdTime;
	}

	public LocalDateTime getUpdatedTime() {
		return updatedTime;
	}

	public void setUpdatedTime(LocalDateTime updatedTime) {
		this.updatedTime = updatedTime;
	}   
    
}
