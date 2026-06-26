package com.locjob.service;

import com.locjob.pojo.RequestPojo;
import com.locjob.pojo.ResponsePojo;

public interface BookingService {

	public ResponsePojo createBooking(RequestPojo requestPojo);

	public ResponsePojo confirmBooking(RequestPojo requestPojo);

	public ResponsePojo rejectBooking(RequestPojo requestPojo);

	public ResponsePojo completeBooking(RequestPojo requestPojo);

	public ResponsePojo cancelBooking(RequestPojo requestPojo);

	public ResponsePojo getBookingsByUser(RequestPojo requestPojo);

	public ResponsePojo getBookingsByProvider(RequestPojo requestPojo);
}