package com.example.crm.dtos


import com.example.crm.entities.*


data class JobOfferDTO (
    val jobOfferId: Long,
    val description: String,
    val status: JobStatus,
    val requiredSkills: MutableSet<Skill>,
    val candidateProfiles: MutableSet<ProfessionalDTO>,
    val duration: Double,
    val offerValue: Double,
    val notes: String?
)

fun JobOffer.toDto(): JobOfferDTO =
    JobOfferDTO(
        this.jobOfferId,
        this.description,
        this.status,
        this.requiredSkills,
        this.candidateProfiles.map { it.toDto() }.toMutableSet(),
        this.duration,
        this.offerValue,
        this.notes
    )


