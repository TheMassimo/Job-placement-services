package com.example.analytics.analytics_dtos

data class ContactAnalyticsDTO(
    val contact_id: Long,
    val category : String?,
    val name : String?,
    val ssn : String?,
    val surname : String?,
)
