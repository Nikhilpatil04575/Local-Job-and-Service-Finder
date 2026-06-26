//package com.locjob.dao;
//
//import com.locjob.entity.ServiceProviderPojo;
//import com.locjob.entity.ServiceUserPojo;
//
//public interface ProviderDao {
//
//	//Service User Dao
//		public boolean insertServiceProvider(ServiceProviderPojo serviceProviderPojo) throws Exception;
//		public boolean updateServiceProvider(ServiceProviderPojo serviceProviderPojo) throws Exception;
//		public ServiceUserPojo getServiceProvider(String uname, String password) throws Exception;	
//}


package com.locjob.dao;

import java.util.List;
import com.locjob.entity.ServiceProviderPojo;

public interface ProviderDao {

    public boolean insertServiceProvider(ServiceProviderPojo serviceProviderPojo) throws Exception;

    public boolean updateServiceProvider(ServiceProviderPojo serviceProviderPojo) throws Exception;

    public List<ServiceProviderPojo> getProvidersByService(String serviceName) throws Exception;

    public List<ServiceProviderPojo> getProvidersByServiceAndCity(String serviceName, String city) throws Exception;
}