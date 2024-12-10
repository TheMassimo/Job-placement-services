package com.example.crm.dtos

data class ProfessionalCreateDTO (
    val contactId: Long,
    val geographicalInfo: String,
    val dailyRate: Double,
    val notes: String,
    val skills: List<Long>?,
)
