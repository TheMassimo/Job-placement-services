package com.example.crm.dtos

data class ProfessionalCreateDTO (
    val geographicalInfo: String,
    val dailyRate: Double,
    val contactId: Long,
    val notes: String
)
