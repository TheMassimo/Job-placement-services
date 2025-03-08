package com.example.crm.dtos

import com.example.crm.entities.JobStatus
import java.time.LocalDateTime

data class JobOfferHistoryDTO(
    val jobOfferHistoryId: Long,
    val jobOfferStatus: JobStatus,
    val date: LocalDateTime?,
    val candidates: MutableSet<ApplicationDTO>,
    val note: String?
)