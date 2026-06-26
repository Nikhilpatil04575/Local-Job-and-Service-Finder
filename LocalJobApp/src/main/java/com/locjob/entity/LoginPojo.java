package com.locjob.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@NamedQueries({
		@NamedQuery(name = "SEARCH_USER", query = "select lt from LoginPojo lt where lt.username= :userName and lt.isActive='Y'") })
@Entity
@Table(name = "LOGIN_TAB")
public class LoginPojo {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "USER_ID")
	private Long userId;

	@Column(name = "USERNAME", length = 50, nullable = false, unique = true)
	private String username;

	@Column(name = "PASSWORD", length = 255, nullable = false)
	private String password;

	@Column(name = "ROLE", length = 20)
	private String role;

	@Column(name = "LOGIN_STATUS")
	private String loginStatus;

	@Column(name = "IS_ACTIVE")
	private String isActive;

	@Column(name = "FAILED_ATTEMPTS")
	private Integer failedAttempts;

	@Column(name = "LAST_LOGIN_TIME")
	private LocalDateTime lastLoginTime;

	@Column(name = "LAST_LOGOUT_TIME")
	private LocalDateTime lastLogoutTime;

	@Column(name = "CREATED_DATE", updatable = false)
	private LocalDateTime createdDate;

	@Column(name = "UPDATED_DATE")
	private LocalDateTime updatedDate;

	/* Automatically set timestamps */
	@PrePersist
	protected void onCreate() {
		createdDate = LocalDateTime.now();
		updatedDate = LocalDateTime.now();
	}

	@PreUpdate
	protected void onUpdate() {
		updatedDate = LocalDateTime.now();
	}

	/* Getters and Setters */

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getLoginStatus() {
		return loginStatus;
	}

	public void setLoginStatus(String loginStatus) {
		this.loginStatus = loginStatus;
	}

	public String getIsActive() {
		return isActive;
	}

	public void setIsActive(String isActive) {
		this.isActive = isActive;
	}

	public Integer getFailedAttempts() {
		return failedAttempts;
	}

	public void setFailedAttempts(Integer failedAttempts) {
		this.failedAttempts = failedAttempts;
	}

	public LocalDateTime getLastLoginTime() {
		return lastLoginTime;
	}

	public void setLastLoginTime(LocalDateTime lastLoginTime) {
		this.lastLoginTime = lastLoginTime;
	}

	public LocalDateTime getLastLogoutTime() {
		return lastLogoutTime;
	}

	public void setLastLogoutTime(LocalDateTime lastLogoutTime) {
		this.lastLogoutTime = lastLogoutTime;
	}

	public LocalDateTime getCreatedDate() {
		return createdDate;
	}

	public LocalDateTime getUpdatedDate() {
		return updatedDate;
	}

	@Override
	public String toString() {
		return "LoginPojo [username=" + username + ", password=" + password + ", role=" + role + ", loginStatus="
				+ loginStatus + ", isActive=" + isActive + ", failedAttempts=" + failedAttempts + ", lastLoginTime="
				+ lastLoginTime + ", lastLogoutTime=" + lastLogoutTime + ", createdDate=" + createdDate
				+ ", updatedDate=" + updatedDate + "]";
	}

}
