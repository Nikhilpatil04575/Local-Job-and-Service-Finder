package com.locjob.service;

import com.locjob.pojo.RequestPojo;
import com.locjob.pojo.ResponsePojo;

public interface ServiceUserService {
	ResponsePojo userRegistration(RequestPojo requestPojo);
	ResponsePojo userUpdation(RequestPojo requestPojo);
	ResponsePojo getUserData(RequestPojo requestPojo);
}
