package com.locjob.dao;

import com.locjob.entity.ServiceUserPojo;

public interface ServiceUserDao {

	//Service User Dao
	public boolean insertServiceUser(ServiceUserPojo serviceUserPojo) throws Exception;
	public boolean updateServiceUser(ServiceUserPojo serviceUserPojo) throws Exception;
	public ServiceUserPojo getServiceUser(String userName, String password) throws Exception;	
	
}
