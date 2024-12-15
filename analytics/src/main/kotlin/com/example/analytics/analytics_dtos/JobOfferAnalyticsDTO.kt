package com.example.analytics.analytics_dtos

import com.example.analytics.services.JobStatus

data class JobOfferAnalyticsDTO (
    val job_offer_id: Long,
    val description: String?,
    val duration: Double,
    val notes: String?,
    val offer_value: Double,
    val required_skills: String?,
    val status: JobStatus?,
    val current_customer_customer_id: Long?,
    val old_customer_customer_id: Long?,
)