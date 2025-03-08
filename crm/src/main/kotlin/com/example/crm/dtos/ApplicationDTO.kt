package com.example.crm.dtos

import com.example.crm.entities.ApplicationStatus
import java.time.LocalDateTime

data class ApplicationDTO(
    val professionalId: Long,
    val jobOfferHistoryId: Long,
    val status: ApplicationStatus,
    val date: LocalDateTime
)
