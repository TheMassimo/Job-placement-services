package com.example.crm.dtos


import com.example.crm.entities.JobOffer
import com.example.crm.entities.JobStatus
import com.example.crm.entities.Skill


data class JobOfferDTO (
    val jobOfferId: Long,
    val description: String,
    val status: JobStatus,
    val requiredSkills: MutableSet<Skill>,
    val duration: Double,
    val offerValue: Double,
    val notes: String?,
)

fun JobOffer.toDto(): JobOfferDTO =
    JobOfferDTO(
        this.jobOfferId,
        this.description,
        this.status,
        this.requiredSkills,
        this.duration,
        this.offerValue,
        this.notes,
    )


