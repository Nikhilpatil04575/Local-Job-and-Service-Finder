package com.locjob.service;

import com.locjob.pojo.RequestPojo;
import com.locjob.pojo.ResponsePojo;

public interface LoginService {
    
	public ResponsePojo loginUser(RequestPojo requestPojo);
	public ResponsePojo logoutUser(RequestPojo requestPojo);
	
}
