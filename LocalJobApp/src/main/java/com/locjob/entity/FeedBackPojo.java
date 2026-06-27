package com.locjob.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@NamedQueries({
    @NamedQuery(
        name = "GET_REVIEWS_BY_PROVIDER",
        query = "select f from FeedBackPojo f where f.providerId = :providerId order by f.createdDate desc"
    ),
    @NamedQuery(
        name = "GET_AVG_RATING_BY_PROVIDER",
        query = "select avg(f.rating) from FeedBackPojo f where f.providerId = :providerId"
    ),
    @NamedQuery(
        name = "CHECK_REVIEW_EXISTS",
        query = "select count(f) from FeedBackPojo f where f.bookingId = :bookingId and f.userId = :userId"
    )
})
@Entity
@Table(name = "feedback_tab")
public class FeedBackPojo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "BOOKING_ID")
    private Long bookingId;

    @Column(name = "PROVIDER_ID")
    private Long providerId;

    @Column(name = "USER_ID")
    private Long userId;

    @Column(name = "USER_NAME", length = 100)
    private String userName;

    @Column(name = "PROVIDER_NAME", length = 100)
    private String providerName;

    @Column(name = "SERVICE_NAME", length = 100)
    private String serviceName;

    @Column(name = "RATING")
    private Integer rating;   // 1 to 5

    @Column(name = "COMMENT", length = 500)
    private String comment;

    @Column(name = "CREATED_DATE", updatable = false)
    private LocalDateTime createdDate;

    public FeedBackPojo() {}

    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public Long getProviderId() { return providerId; }
    public void setProviderId(Long providerId) { this.providerId = providerId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
}
