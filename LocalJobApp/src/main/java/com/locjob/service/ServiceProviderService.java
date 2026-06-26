package com.locjob.service;

import com.locjob.pojo.RequestPojo;
import com.locjob.pojo.ResponsePojo;

public interface ServiceProviderService {

	ResponsePojo serviceProviderRegistration(RequestPojo requestPojo);

	ResponsePojo serviceProviderUpdation(RequestPojo requestPojo);

	ResponsePojo getServiceProviderData(RequestPojo requestPojo);

	// Search providers by service name and optional city filter
	ResponsePojo getProvidersByService(String serviceName, String city);
}