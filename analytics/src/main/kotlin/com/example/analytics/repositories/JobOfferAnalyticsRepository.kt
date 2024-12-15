package com.example.analytics.repositories

import com.example.analytics.services.JobStatus
import com.example.analytics.entities.Customer
import com.example.analytics.entities.JobOffer
import com.example.analytics.entities.JobOfferAnalytics
import com.example.analytics.entities.Professional
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable

@Repository                                 //Entity , Id
interface JobOfferAnalyticsRepository: JpaRepository<JobOfferAnalytics, Long> {

    fun findByJobOfferId(jobOfferId: Long): JobOfferAnalytics
}