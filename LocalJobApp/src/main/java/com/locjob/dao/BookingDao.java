package com.locjob.dao;

import java.util.List;
import com.locjob.entity.ServiceBookingPojo;

public interface BookingDao {

	public boolean insertBooking(ServiceBookingPojo bookingPojo) throws Exception;

	public boolean updateBooking(ServiceBookingPojo bookingPojo) throws Exception;

	public List<ServiceBookingPojo> getBookingsByUser(Long userId) throws Exception;

	public List<ServiceBookingPojo> getBookingsByProvider(Long providerId) throws Exception;

	public ServiceBookingPojo getBookingById(Long id) throws Exception;
}