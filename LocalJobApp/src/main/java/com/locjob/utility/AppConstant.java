package com.locjob.utility;

public class AppConstant {

    // Active flags
    public static final String Y = "Y";
    public static final String N = "N";

    // Roles
    public static final String USER     = "USER";
    public static final String PROVIDER = "PROVIDER";

    // Login status
    public static final String LOGIN  = "LOGIN";
    public static final String LOGOUT = "LOGOUT";

    // Misc
    public static final String ZERO = "0";

    // Response status
    public static final String SUCCESS = "SUCCESS";
    public static final String FAILED  = "FAILED";

    // Named query constants
    public static final String SEARCH_USER              = "SEARCH_USER";
    public static final String SEARCH_PROVIDER          = "SEARCH_PROVIDER";
    public static final String SEARCH_PROVIDER_BY_CITY  = "SEARCH_PROVIDER_BY_CITY";
    public static final String GET_BOOKINGS_BY_USER     = "GET_BOOKINGS_BY_USER";
    public static final String GET_BOOKINGS_BY_PROVIDER = "GET_BOOKINGS_BY_PROVIDER";
    public static final String GET_BOOKING_BY_ID        = "GET_BOOKING_BY_ID";

    // Booking status
    public static final String BOOKING_PENDING   = "PENDING";
    public static final String BOOKING_CONFIRMED = "CONFIRMED";
    public static final String BOOKING_REJECTED  = "REJECTED";
    public static final String BOOKING_COMPLETED = "COMPLETED";
    public static final String BOOKING_CANCELLED = "CANCELLED";
}