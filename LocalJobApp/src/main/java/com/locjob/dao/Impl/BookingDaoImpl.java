package com.locjob.dao.Impl;

import java.util.List;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.locjob.dao.BookingDao;
import com.locjob.entity.ServiceBookingPojo;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

@Repository
@Transactional
public class BookingDaoImpl implements BookingDao {

    @PersistenceContext
    EntityManager entityManager;

    @Override
    public boolean insertBooking(ServiceBookingPojo bookingPojo) throws Exception {
        System.out.println("Inside insertBooking");
        boolean response = false;
        try {
            entityManager.persist(bookingPojo);
            response = true;
        } catch (Exception ex) {
            System.out.println("insertBooking error: " + ex.getMessage());
            throw ex;
        }
        return response;
    }

    @Override
    public boolean updateBooking(ServiceBookingPojo bookingPojo) throws Exception {
        System.out.println("Inside updateBooking");
        boolean response = false;
        try {
            entityManager.merge(bookingPojo);
            response = true;
        } catch (Exception ex) {
            System.out.println("updateBooking error: " + ex.getMessage());
            throw ex;
        }
        return response;
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<ServiceBookingPojo> getBookingsByUser(Long userId) throws Exception {
        List<ServiceBookingPojo> list = null;
        try {
            Query q = entityManager.createNamedQuery("GET_BOOKINGS_BY_USER");
            q.setParameter("userId", userId);
            list = (List<ServiceBookingPojo>) q.getResultList();
        } catch (Exception ex) {
            System.out.println("getBookingsByUser error: " + ex.getMessage());
        }
        return list;
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<ServiceBookingPojo> getBookingsByProvider(Long providerId) throws Exception {
        List<ServiceBookingPojo> list = null;
        try {
            Query q = entityManager.createNamedQuery("GET_BOOKINGS_BY_PROVIDER");
            q.setParameter("providerId", providerId);
            list = (List<ServiceBookingPojo>) q.getResultList();
        } catch (Exception ex) {
            System.out.println("getBookingsByProvider error: " + ex.getMessage());
        }
        return list;
    }

    @Override
    @SuppressWarnings("unchecked")
    public ServiceBookingPojo getBookingById(Long id) throws Exception {
        ServiceBookingPojo booking = null;
        try {
            Query q = entityManager.createNamedQuery("GET_BOOKING_BY_ID");
            q.setParameter("id", id);
            List<ServiceBookingPojo> list = (List<ServiceBookingPojo>) q.getResultList();
            if (list != null && !list.isEmpty()) {
                booking = list.get(0);
            }
        } catch (Exception ex) {
            System.out.println("getBookingById error: " + ex.getMessage());
        }
        return booking;
    }
}