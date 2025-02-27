package com.example.analytics.analytics_dtos

data class ProfessionalAnalyticsDTO (
    val professional_id: Long,
    val daily_rate: Long,
    val employment: String?,
    val geographical_info: String?,
    val notes: String?,
    val contact_contact_id: Long?,
    val job_offer_job_offer_id: Long?,
    val job_offer_proposal_job_offer_id: Long?
)