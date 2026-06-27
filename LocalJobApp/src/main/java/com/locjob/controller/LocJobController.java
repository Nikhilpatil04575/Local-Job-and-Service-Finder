////package com.locjob.controller;
////
////import org.springframework.beans.factory.annotation.Autowired;
////import org.springframework.web.bind.annotation.RequestBody;
////import org.springframework.web.bind.annotation.RequestMapping;
////import org.springframework.web.bind.annotation.RequestMethod;
////import org.springframework.web.bind.annotation.ResponseBody;
////import org.springframework.web.bind.annotation.RestController;
////
////import com.locjob.pojo.RequestPojo;
////import com.locjob.pojo.ResponsePojo;
////import com.locjob.service.LoginService;
////import com.locjob.service.ServiceProviderService;
////import com.locjob.service.ServiceUserService;
////
////import jakarta.ws.rs.Consumes;
////
////@RestController
////@RequestMapping("/request")
////public class LocJobController {
////
////	@Autowired
////	ServiceUserService serviceUser;
////
////	@Autowired
////	LoginService loginService;
////	
////	@Autowired
////	ServiceProviderService serviceProvider;
////
////	@RequestMapping(value = "register", method = RequestMethod.POST)
////	@Consumes("application/json")
////	public @ResponseBody ResponsePojo ServiceUserRegister(@RequestBody RequestPojo request) {
////		ResponsePojo response = null;
////		if (request != null) {
////			response = new ResponsePojo();
////			response = serviceUser.userRegistration(request);
////		}
////		return response;
////	}
////
////	@RequestMapping(value = "login", method = RequestMethod.POST)
////	@Consumes("application/json")
////	public @ResponseBody ResponsePojo LoginUser(@RequestBody RequestPojo request) {
////		ResponsePojo response = null;
////		if (request != null) {
////			response = new ResponsePojo();
////			response = loginService.loginUser(request);
////		}
////		return response;
////	}
////	
////	@RequestMapping(value = "logout", method = RequestMethod.POST)
////	@Consumes("application/json")
////	public @ResponseBody ResponsePojo LogoutUser(@RequestBody RequestPojo request) {
////		ResponsePojo response = null;
////		if (request != null) {
////			response = new ResponsePojo();
////			response = loginService.logoutUser(request);
////		}
////		return response;
////	}
////	
////	@RequestMapping(value = "serviceProvider", method = RequestMethod.POST)
////	@Consumes("application/json")
////	public @ResponseBody ResponsePojo providerRegister(@RequestBody RequestPojo request) {
////		ResponsePojo response = null;
////		if (request != null) {
////			response = new ResponsePojo();
////			response = serviceProvider.serviceProviderRegistration(request);
////		}
////		return response;
////	}
////	
////	@RequestMapping(value = "register", method = RequestMethod.POST)
////	@Consumes("application/json")
////	public @ResponseBody ResponsePojo providerUpdation(@RequestBody RequestPojo request) {
////		ResponsePojo response = null;
////		if (request != null) {
////			response = new ResponsePojo();
////			response = serviceUser.userRegistration(request);
////		}
////		return response;
////	}
////}
//
//
//package com.locjob.controller;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestMethod;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.ResponseBody;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.locjob.pojo.RequestPojo;
//import com.locjob.pojo.ResponsePojo;
//import com.locjob.service.LoginService;
//import com.locjob.service.ServiceProviderService;
//import com.locjob.service.ServiceUserService;
//
//@RestController
//@RequestMapping("/request")
//public class LocJobController {
//
//    @Autowired
//    ServiceUserService serviceUser;
//
//    @Autowired
//    LoginService loginService;
//
//    @Autowired
//    ServiceProviderService serviceProvider;
//
//    // ── User register ─────────────────────────────────────────────────────────
//    @RequestMapping(value = "register", method = RequestMethod.POST)
//    public @ResponseBody ResponsePojo serviceUserRegister(@RequestBody RequestPojo request) {
//        ResponsePojo response = null;
//        if (request != null) {
//            response = serviceUser.userRegistration(request);
//        }
//        return response;
//    }
//
//    // ── Login ─────────────────────────────────────────────────────────────────
//    @RequestMapping(value = "login", method = RequestMethod.POST)
//    public @ResponseBody ResponsePojo loginUser(@RequestBody RequestPojo request) {
//        ResponsePojo response = null;
//        if (request != null) {
//            response = loginService.loginUser(request);
//        }
//        return response;
//    }
//
//    // ── Logout ────────────────────────────────────────────────────────────────
//    @RequestMapping(value = "logout", method = RequestMethod.POST)
//    public @ResponseBody ResponsePojo logoutUser(@RequestBody RequestPojo request) {
//        ResponsePojo response = null;
//        if (request != null) {
//            response = loginService.logoutUser(request);
//        }
//        return response;
//    }
//
//    // ── Service provider register ─────────────────────────────────────────────
//    // FIX: was incorrectly mapped to "register" — now correctly "serviceProvider"
//    @RequestMapping(value = "serviceProvider", method = RequestMethod.POST)
//    public @ResponseBody ResponsePojo providerRegister(@RequestBody RequestPojo request) {
//        ResponsePojo response = null;
//        if (request != null) {
//            response = serviceProvider.serviceProviderRegistration(request);
//        }
//        return response;
//    }
//
//    // ── Service provider update ───────────────────────────────────────────────
//    @RequestMapping(value = "providerUpdate", method = RequestMethod.POST)
//    public @ResponseBody ResponsePojo providerUpdate(@RequestBody RequestPojo request) {
//        ResponsePojo response = null;
//        if (request != null) {
//            response = serviceProvider.serviceProviderUpdation(request);
//        }
//        return response;
//    }
//
//    // ── Search providers by service + optional city ───────────────────────────
//    // Called by frontend: GET /request/providers?serviceType=Plumber&city=Pune
//    @GetMapping("providers")
//    public @ResponseBody ResponsePojo getProviders(
//            @RequestParam(required = true)  String serviceType,
//            @RequestParam(required = false) String city,
//            @RequestParam(required = false) String location) {
//        return serviceProvider.getProvidersByService(serviceType, city);
//    }
//}

package com.locjob.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.locjob.pojo.RequestPojo;
import com.locjob.pojo.ResponsePojo;
import com.locjob.service.BookingService;
import com.locjob.service.EmailService;
import com.locjob.service.FeedbackService;
import com.locjob.service.LoginService;
import com.locjob.service.ServiceProviderService;
import com.locjob.service.ServiceUserService;

@RestController
@RequestMapping("/request")
public class LocJobController {

    @Autowired
    ServiceUserService serviceUser;

    @Autowired
    LoginService loginService;

    @Autowired
    ServiceProviderService serviceProvider;

    @Autowired
    BookingService bookingService;
    
    @Autowired
    private EmailService emailService;

    @Autowired
    private FeedbackService feedbackService;
    
    @RequestMapping(
            value = "/send-provider-mail",
            method = RequestMethod.POST
    )
    public @ResponseBody ResponsePojo sendProviderMail(
            @RequestBody RequestPojo request
    ) {

        ResponsePojo response = new ResponsePojo();

        try {

            emailService.sendBookingNotificationToProvider(
                    request.getProviderEmail(),
                    request.getCustomerName(),
                    request.getServiceName()
            );

            response.setMsg("Mail Sent Successfully");

        } catch (Exception e) {

        	response.setMsg("Failed To Send Mail");
        }

        return response;
    }

    // ── User Register ─────────────────────────────────────────────────────────
    @RequestMapping(value = "register", method = RequestMethod.POST)
    public @ResponseBody ResponsePojo serviceUserRegister(@RequestBody RequestPojo request) {
        if (request != null) return serviceUser.userRegistration(request);
        return null;
    }

    // ── Login ─────────────────────────────────────────────────────────────────
    @RequestMapping(value = "login", method = RequestMethod.POST)
    public @ResponseBody ResponsePojo loginUser(@RequestBody RequestPojo request) {
        if (request != null) return loginService.loginUser(request);
        return null;
    }

    // ── Logout ────────────────────────────────────────────────────────────────
    @RequestMapping(value = "logout", method = RequestMethod.POST)
    public @ResponseBody ResponsePojo logoutUser(@RequestBody RequestPojo request) {
        if (request != null) return loginService.logoutUser(request);
        return null;
    }

    // ── SP Register ───────────────────────────────────────────────────────────
    @RequestMapping(value = "serviceProvider", method = RequestMethod.POST)
    public @ResponseBody ResponsePojo providerRegister(@RequestBody RequestPojo request) {
        if (request != null) return serviceProvider.serviceProviderRegistration(request);
        return null;
    }

    // ── SP Update ─────────────────────────────────────────────────────────────
    @RequestMapping(value = "providerUpdate", method = RequestMethod.POST)
    public @ResponseBody ResponsePojo providerUpdate(@RequestBody RequestPojo request) {
        if (request != null) return serviceProvider.serviceProviderUpdation(request);
        return null;
    }

    // ── Search Providers (with optional city + location filter) ──────────────
    @GetMapping("providers")
    public @ResponseBody ResponsePojo getProviders(
            @RequestParam(required = true)  String serviceType,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String location) {
        return serviceProvider.getProvidersByService(serviceType, city, location);
    }

    // ── Booking: Create ───────────────────────────────────────────────────────
    @RequestMapping(value = "booking/create", method = RequestMethod.POST)
    public @ResponseBody ResponsePojo createBooking(@RequestBody RequestPojo request) {
        if (request != null) return bookingService.createBooking(request);
        return null;
    }

    // ── Booking: Confirm ──────────────────────────────────────────────────────
    @RequestMapping(value = "booking/confirm", method = RequestMethod.POST)
    public @ResponseBody ResponsePojo confirmBooking(@RequestBody RequestPojo request) {
        if (request != null) return bookingService.confirmBooking(request);
        return null;
    }

    // ── Booking: Reject ───────────────────────────────────────────────────────
    @RequestMapping(value = "booking/reject", method = RequestMethod.POST)
    public @ResponseBody ResponsePojo rejectBooking(@RequestBody RequestPojo request) {
        if (request != null) return bookingService.rejectBooking(request);
        return null;
    }

    // ── Booking: Complete ─────────────────────────────────────────────────────
    @RequestMapping(value = "booking/complete", method = RequestMethod.POST)
    public @ResponseBody ResponsePojo completeBooking(@RequestBody RequestPojo request) {
        if (request != null) return bookingService.completeBooking(request);
        return null;
    }

    // ── Booking: Cancel ───────────────────────────────────────────────────────
    @RequestMapping(value = "booking/cancel", method = RequestMethod.POST)
    public @ResponseBody ResponsePojo cancelBooking(@RequestBody RequestPojo request) {
        if (request != null) return bookingService.cancelBooking(request);
        return null;
    }

    // ── Booking: Get by User ──────────────────────────────────────────────────
    @GetMapping("booking/user")
    public @ResponseBody ResponsePojo getBookingsByUser(@RequestParam Long userId) {
        RequestPojo req = new RequestPojo();
        req.setUserId(userId);
        return bookingService.getBookingsByUser(req);
    }

    // ── Booking: Get by Provider ──────────────────────────────────────────────
    @GetMapping("booking/provider")
    public @ResponseBody ResponsePojo getBookingsByProvider(@RequestParam Long providerId) {
        RequestPojo req = new RequestPojo();
        req.setProviderId(providerId);
        return bookingService.getBookingsByProvider(req);
    }

    // ── Review: Submit ────────────────────────────────────────────────────────
    @RequestMapping(value = "review/submit", method = RequestMethod.POST)
    public @ResponseBody ResponsePojo submitReview(@RequestBody RequestPojo request) {
        if (request != null) return feedbackService.submitReview(request);
        return null;
    }

    // ── Review: Get by Provider ───────────────────────────────────────────────
    @GetMapping("review/provider")
    public @ResponseBody ResponsePojo getReviewsByProvider(@RequestParam Long providerId) {
        RequestPojo req = new RequestPojo();
        req.setProviderId(providerId);
        return feedbackService.getReviewsByProvider(req);
    }
}