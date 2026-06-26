package com.locjob.dao;

import com.locjob.entity.LoginPojo;

public interface LoginDao {
	// Login Dao
	public boolean insertLoginDetails(LoginPojo loginPojo) throws Exception;

	public LoginPojo loginUser(String userName, String password, String role) throws Exception;

	public boolean updateLoginDetails(LoginPojo loginPojo) throws Exception;
	
	public LoginPojo logoutUser(String userName) throws Exception;

}
