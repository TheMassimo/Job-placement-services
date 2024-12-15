package com.example.analytics.analytics_dtos

data class SkillOccurrenceDTO (
    val skill_id: Long,
    val job_offer_id: Long,
    val skill: String?
)