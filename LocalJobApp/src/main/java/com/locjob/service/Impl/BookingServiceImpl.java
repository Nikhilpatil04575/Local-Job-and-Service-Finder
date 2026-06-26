//package com.locjob.service.Impl;
//
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Component;
//
//import com.locjob.dao.BookingDao;
//import com.locjob.entity.ServiceBookingPojo;
//import com.locjob.pojo.RequestPojo;
//import com.locjob.pojo.ResponsePojo;
//import com.locjob.service.BookingService;
//import com.locjob.utility.AppConstant;
//
//@Component
//public class BookingServiceImpl implements BookingService {
//
//	@Autowired
//	BookingDao bookingDao;
//
//	// ── User sends booking request ────────────────────────────────────────────
//	@Override
//	public ResponsePojo createBooking(RequestPojo requestPojo) {
//		ResponsePojo response = new ResponsePojo();
//		Map<String, Object> resMap = new HashMap<>();
//
//		try {
//			ServiceBookingPojo booking = new ServiceBookingPojo();
//			booking.setProviderId(requestPojo.getProviderId());
//			booking.setUserId(requestPojo.getUserId());
//			booking.setUserName(requestPojo.getUserName());
//			booking.setProviderName(requestPojo.getProviderName());
//			booking.setServiceName(requestPojo.getServiceName());
//			booking.setServiceDescription(requestPojo.getDescription());
//			booking.setServiceAddress(requestPojo.getAddress());
//			booking.setServiceCity(requestPojo.getCity());
//			booking.setServiceLocation(requestPojo.getLocation());
//			booking.setBookingStatus(AppConstant.BOOKING_PENDING);
//			booking.setIsActive(AppConstant.Y);
//			booking.setBookDate(LocalDateTime.now());
//
//			boolean inserted = bookingDao.insertBooking(booking);
//			if (inserted) {
//				response.setStatus(AppConstant.SUCCESS);
//				response.setMsg("Booking request sent successfully! Provider will confirm shortly.");
//				resMap.put("bookingId", booking.getId());
//				resMap.put("bookingStatus", AppConstant.BOOKING_PENDING);
//				response.setResponseMap(resMap);
//			} else {
//				response.setStatus(AppConstant.FAILED);
//				response.setMsg("Failed to create booking. Please try again.");
//			}
//		} catch (Exception ex) {
//			response.setStatus(AppConstant.FAILED);
//			response.setMsg("Error: " + ex.getMessage());
//			System.out.println(ex.getMessage());
//		}
//		return response;
//	}
//
//	// ── Provider confirms booking ─────────────────────────────────────────────
//	@Override
//	public ResponsePojo confirmBooking(RequestPojo requestPojo) {
//		ResponsePojo response = new ResponsePojo();
//		Map<String, Object> resMap = new HashMap<>();
//
//		try {
//			ServiceBookingPojo booking = bookingDao.getBookingById(requestPojo.getBookingId());
//			if (booking == null) {
//				response.setStatus(AppConstant.FAILED);
//				response.setMsg("Booking not found.");
//				return response;
//			}
//
//			booking.setBookingStatus(AppConstant.BOOKING_CONFIRMED);
//			booking.setServiceCharge(requestPojo.getServiceCharge());
//			booking.setConfirmDate(LocalDateTime.now());
//
//			boolean updated = bookingDao.updateBooking(booking);
//			if (updated) {
//				response.setStatus(AppConstant.SUCCESS);
//				response.setMsg("Booking confirmed! User has been notified.");
//				resMap.put("bookingId", booking.getId());
//				resMap.put("bookingStatus", AppConstant.BOOKING_CONFIRMED);
//				response.setResponseMap(resMap);
//			} else {
//				response.setStatus(AppConstant.FAILED);
//				response.setMsg("Failed to confirm booking.");
//			}
//		} catch (Exception ex) {
//			response.setStatus(AppConstant.FAILED);
//			response.setMsg("Error: " + ex.getMessage());
//		}
//		return response;
//	}
//
//	// ── Provider rejects booking ──────────────────────────────────────────────
//	@Override
//	public ResponsePojo rejectBooking(RequestPojo requestPojo) {
//		ResponsePojo response = new ResponsePojo();
//		Map<String, Object> resMap = new HashMap<>();
//
//		try {
//			ServiceBookingPojo booking = bookingDao.getBookingById(requestPojo.getBookingId());
//			if (booking == null) {
//				response.setStatus(AppConstant.FAILED);
//				response.setMsg("Booking not found.");
//				return response;
//			}
//
//			booking.setBookingStatus(AppConstant.BOOKING_REJECTED);
//
//			boolean updated = bookingDao.updateBooking(booking);
//			if (updated) {
//				response.setStatus(AppConstant.SUCCESS);
//				response.setMsg("Booking rejected.");
//				resMap.put("bookingId", booking.getId());
//				resMap.put("bookingStatus", AppConstant.BOOKING_REJECTED);
//				response.setResponseMap(resMap);
//			} else {
//				response.setStatus(AppConstant.FAILED);
//				response.setMsg("Failed to reject booking.");
//			}
//		} catch (Exception ex) {
//			response.setStatus(AppConstant.FAILED);
//			response.setMsg("Error: " + ex.getMessage());
//		}
//		return response;
//	}
//
//	// ── Provider marks job complete ───────────────────────────────────────────
//	@Override
//	public ResponsePojo completeBooking(RequestPojo requestPojo) {
//		ResponsePojo response = new ResponsePojo();
//		Map<String, Object> resMap = new HashMap<>();
//
//		try {
//			ServiceBookingPojo booking = bookingDao.getBookingById(requestPojo.getBookingId());
//			if (booking == null) {
//				response.setStatus(AppConstant.FAILED);
//				response.setMsg("Booking not found.");
//				return response;
//			}
//
//			booking.setBookingStatus(AppConstant.BOOKING_COMPLETED);
//			booking.setCompleteDate(LocalDateTime.now());
//
//			boolean updated = bookingDao.updateBooking(booking);
//			if (updated) {
//				response.setStatus(AppConstant.SUCCESS);
//				response.setMsg("Job marked as completed.");
//				resMap.put("bookingId", booking.getId());
//				resMap.put("bookingStatus", AppConstant.BOOKING_COMPLETED);
//				response.setResponseMap(resMap);
//			} else {
//				response.setStatus(AppConstant.FAILED);
//				response.setMsg("Failed to complete booking.");
//			}
//		} catch (Exception ex) {
//			response.setStatus(AppConstant.FAILED);
//			response.setMsg("Error: " + ex.getMessage());
//		}
//		return response;
//	}
//
//	// ── User cancels booking ──────────────────────────────────────────────────
//	@Override
//	public ResponsePojo cancelBooking(RequestPojo requestPojo) {
//		ResponsePojo response = new ResponsePojo();
//		Map<String, Object> resMap = new HashMap<>();
//
//		try {
//			ServiceBookingPojo booking = bookingDao.getBookingById(requestPojo.getBookingId());
//			if (booking == null) {
//				response.setStatus(AppConstant.FAILED);
//				response.setMsg("Booking not found.");
//				return response;
//			}
//
//			booking.setBookingStatus(AppConstant.BOOKING_CANCELLED);
//			booking.setIsActive(AppConstant.N);
//
//			boolean updated = bookingDao.updateBooking(booking);
//			if (updated) {
//				response.setStatus(AppConstant.SUCCESS);
//				response.setMsg("Booking cancelled.");
//				resMap.put("bookingId", booking.getId());
//				response.setResponseMap(resMap);
//			} else {
//				response.setStatus(AppConstant.FAILED);
//				response.setMsg("Failed to cancel booking.");
//			}
//		} catch (Exception ex) {
//			response.setStatus(AppConstant.FAILED);
//			response.setMsg("Error: " + ex.getMessage());
//		}
//		return response;
//	}
//
//	// ── User views booking history ────────────────────────────────────────────
//	@Override
//	public ResponsePojo getBookingsByUser(RequestPojo requestPojo) {
//		ResponsePojo response = new ResponsePojo();
//		Map<String, Object> resMap = new HashMap<>();
//
//		try {
//			List<ServiceBookingPojo> bookings = bookingDao.getBookingsByUser(requestPojo.getUserId());
//			if (bookings == null) bookings = new ArrayList<>();
//
//			resMap.put("data", buildBookingList(bookings));
//			response.setStatus(AppConstant.SUCCESS);
//			response.setMsg(bookings.size() + " booking(s) found");
//			response.setResponseMap(resMap);
//		} catch (Exception ex) {
//			response.setStatus(AppConstant.FAILED);
//			response.setMsg("Error: " + ex.getMessage());
//		}
//		return response;
//	}
//
//	// ── Provider views incoming orders ────────────────────────────────────────
//	@Override
//	public ResponsePojo getBookingsByProvider(RequestPojo requestPojo) {
//		ResponsePojo response = new ResponsePojo();
//		Map<String, Object> resMap = new HashMap<>();
//
//		try {
//			List<ServiceBookingPojo> bookings = bookingDao.getBookingsByProvider(requestPojo.getProviderId());
//			if (bookings == null) bookings = new ArrayList<>();
//
//			resMap.put("data", buildBookingList(bookings));
//			response.setStatus(AppConstant.SUCCESS);
//			response.setMsg(bookings.size() + " order(s) found");
//			response.setResponseMap(resMap);
//		} catch (Exception ex) {
//			response.setStatus(AppConstant.FAILED);
//			response.setMsg("Error: " + ex.getMessage());
//		}
//		return response;
//	}
//
//	// ── Helper: build clean response list ─────────────────────────────────────
//	private List<Map<String, Object>> buildBookingList(List<ServiceBookingPojo> bookings) {
//		List<Map<String, Object>> list = new ArrayList<>();
//		for (ServiceBookingPojo b : bookings) {
//			Map<String, Object> item = new HashMap<>();
//			item.put("id",                 b.getId());
//			item.put("providerId",         b.getProviderId());
//			item.put("userId",             b.getUserId());
//			item.put("userName",           b.getUserName());
//			item.put("providerName",       b.getProviderName());
//			item.put("serviceName",        b.getServiceName());
//			item.put("serviceDescription", b.getServiceDescription());
//			item.put("serviceCity",        b.getServiceCity());
//			item.put("serviceLocation",    b.getServiceLocation());
//			item.put("serviceAddress",     b.getServiceAddress());
//			item.put("bookingStatus",      b.getBookingStatus());
//			item.put("serviceCharge",      b.getServiceCharge());
//			item.put("bookDate",           b.getBookDate()     != null ? b.getBookDate().toString()     : null);
//			item.put("confirmDate",        b.getConfirmDate()  != null ? b.getConfirmDate().toString()  : null);
//			item.put("completeDate",       b.getCompleteDate() != null ? b.getCompleteDate().toString() : null);
//			list.add(item);
//		}
//		return list;
//	}
//}

package com.locjob.service.Impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.locjob.dao.BookingDao;
import com.locjob.entity.ServiceBookingPojo;
import com.locjob.pojo.RequestPojo;
import com.locjob.pojo.ResponsePojo;
import com.locjob.service.BookingService;
import com.locjob.utility.AppConstant;

@Component
public class BookingServiceImpl implements BookingService {

    @Autowired
    BookingDao bookingDao;

    @Override
    @Transactional
    public ResponsePojo createBooking(RequestPojo requestPojo) {
        ResponsePojo response = new ResponsePojo();
        Map<String, Object> resMap = new HashMap<>();
        try {
            ServiceBookingPojo booking = new ServiceBookingPojo();
            booking.setProviderId(requestPojo.getProviderId());
            booking.setUserId(requestPojo.getUserId());
            booking.setUserName(requestPojo.getUserName());
            booking.setProviderName(requestPojo.getProviderName());
            booking.setServiceName(requestPojo.getServiceName());
            booking.setDescription(requestPojo.getDescription());
            booking.setAddress(requestPojo.getAddress());
            booking.setCity(requestPojo.getCity());
            booking.setLocation(requestPojo.getLocation());
            booking.setBookingStatus(AppConstant.BOOKING_PENDING);
            booking.setIsActive(AppConstant.Y);

            boolean inserted = bookingDao.insertBooking(booking);
            if (inserted) {
                response.setStatus(AppConstant.SUCCESS);
                response.setMsg("Booking created successfully");
                resMap.put("bookingId", booking.getId());
                resMap.put("status", AppConstant.BOOKING_PENDING);
                response.setResponseMap(resMap);
            } else {
                response.setStatus(AppConstant.FAILED);
                response.setMsg("Booking creation failed");
            }
        } catch (Exception ex) {
            response.setStatus(AppConstant.FAILED);
            response.setMsg("Error: " + ex.getMessage());
            System.out.println(ex.getMessage());
        }
        return response;
    }

    @Override
    @Transactional
    public ResponsePojo confirmBooking(RequestPojo requestPojo) {
        ResponsePojo response = new ResponsePojo();
        try {
            ServiceBookingPojo booking = bookingDao.getBookingById(requestPojo.getBookingId());
            if (booking != null) {
                booking.setBookingStatus(AppConstant.BOOKING_CONFIRMED);
                booking.setServiceCharge(requestPojo.getServiceCharge());
                booking.setConfirmedDate(LocalDateTime.now());
                bookingDao.updateBooking(booking);
                response.setStatus(AppConstant.SUCCESS);
                response.setMsg("Booking confirmed");
            } else {
                response.setStatus(AppConstant.FAILED);
                response.setMsg("Booking not found");
            }
        } catch (Exception ex) {
            response.setStatus(AppConstant.FAILED);
            response.setMsg("Error: " + ex.getMessage());
        }
        return response;
    }

    @Override
    @Transactional
    public ResponsePojo rejectBooking(RequestPojo requestPojo) {
        ResponsePojo response = new ResponsePojo();
        try {
            ServiceBookingPojo booking = bookingDao.getBookingById(requestPojo.getBookingId());
            if (booking != null) {
                booking.setBookingStatus(AppConstant.BOOKING_REJECTED);
                bookingDao.updateBooking(booking);
                response.setStatus(AppConstant.SUCCESS);
                response.setMsg("Booking rejected");
            } else {
                response.setStatus(AppConstant.FAILED);
                response.setMsg("Booking not found");
            }
        } catch (Exception ex) {
            response.setStatus(AppConstant.FAILED);
            response.setMsg("Error: " + ex.getMessage());
        }
        return response;
    }

    @Override
    @Transactional
    public ResponsePojo completeBooking(RequestPojo requestPojo) {
        ResponsePojo response = new ResponsePojo();
        try {
            ServiceBookingPojo booking = bookingDao.getBookingById(requestPojo.getBookingId());
            if (booking != null) {
                booking.setBookingStatus(AppConstant.BOOKING_COMPLETED);
                booking.setCompletedDate(LocalDateTime.now());
                bookingDao.updateBooking(booking);
                response.setStatus(AppConstant.SUCCESS);
                response.setMsg("Booking completed");
            } else {
                response.setStatus(AppConstant.FAILED);
                response.setMsg("Booking not found");
            }
        } catch (Exception ex) {
            response.setStatus(AppConstant.FAILED);
            response.setMsg("Error: " + ex.getMessage());
        }
        return response;
    }

    @Override
    @Transactional
    public ResponsePojo cancelBooking(RequestPojo requestPojo) {
        ResponsePojo response = new ResponsePojo();
        try {
            ServiceBookingPojo booking = bookingDao.getBookingById(requestPojo.getBookingId());
            if (booking != null) {
                booking.setBookingStatus(AppConstant.BOOKING_CANCELLED);
                bookingDao.updateBooking(booking);
                response.setStatus(AppConstant.SUCCESS);
                response.setMsg("Booking cancelled");
            } else {
                response.setStatus(AppConstant.FAILED);
                response.setMsg("Booking not found");
            }
        } catch (Exception ex) {
            response.setStatus(AppConstant.FAILED);
            response.setMsg("Error: " + ex.getMessage());
        }
        return response;
    }

    @Override
    public ResponsePojo getBookingsByUser(RequestPojo requestPojo) {
        ResponsePojo response = new ResponsePojo();
        Map<String, Object> resMap = new HashMap<>();
        try {
            List<ServiceBookingPojo> list = bookingDao.getBookingsByUser(requestPojo.getUserId());
            if (list == null) list = new ArrayList<>();

            List<Map<String, Object>> result = new ArrayList<>();
            for (ServiceBookingPojo b : list) {
                result.add(bookingToMap(b));
            }
            resMap.put("bookings", result);
            response.setStatus(AppConstant.SUCCESS);
            response.setMsg("Bookings fetched: " + result.size());
            response.setResponseMap(resMap);
        } catch (Exception ex) {
            response.setStatus(AppConstant.FAILED);
            response.setMsg("Error: " + ex.getMessage());
        }
        return response;
    }

    @Override
    public ResponsePojo getBookingsByProvider(RequestPojo requestPojo) {
        ResponsePojo response = new ResponsePojo();
        Map<String, Object> resMap = new HashMap<>();
        try {
            List<ServiceBookingPojo> list = bookingDao.getBookingsByProvider(requestPojo.getProviderId());
            if (list == null) list = new ArrayList<>();

            List<Map<String, Object>> result = new ArrayList<>();
            for (ServiceBookingPojo b : list) {
                result.add(bookingToMap(b));
            }
            resMap.put("bookings", result);
            response.setStatus(AppConstant.SUCCESS);
            response.setMsg("Orders fetched: " + result.size());
            response.setResponseMap(resMap);
        } catch (Exception ex) {
            response.setStatus(AppConstant.FAILED);
            response.setMsg("Error: " + ex.getMessage());
        }
        return response;
    }

    private Map<String, Object> bookingToMap(ServiceBookingPojo b) {
        Map<String, Object> m = new HashMap<>();
        m.put("id",            b.getId());
        m.put("providerId",    b.getProviderId());
        m.put("userId",        b.getUserId());
        m.put("userName",      b.getUserName());
        m.put("providerName",  b.getProviderName());
        m.put("serviceName",   b.getServiceName());
        m.put("description",   b.getDescription());
        m.put("address",       b.getAddress());
        m.put("city",          b.getCity());
        m.put("location",      b.getLocation());
        m.put("bookingStatus", b.getBookingStatus());
        m.put("serviceCharge", b.getServiceCharge());
        m.put("createdDate",   b.getCreatedDate() != null ? b.getCreatedDate().toString() : "");
        return m;
    }
}