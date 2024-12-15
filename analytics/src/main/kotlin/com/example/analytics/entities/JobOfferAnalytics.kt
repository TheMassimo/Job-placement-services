package com.example.analytics.entities

import com.example.analytics.services.JobStatus
import jakarta.persistence.*

@Entity
class JobOfferAnalytics {
    @Id
    @GeneratedValue
    var jobOfferId: Long = 0

    var status: JobStatus? = JobStatus.CREATED
    lateinit var requiredSkills: String
    var duration: Double = 0.0
    var offerValue: Double = 0.0
}

