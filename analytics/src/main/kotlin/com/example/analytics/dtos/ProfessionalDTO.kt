package com.example.analytics.dtos

import com.example.analytics.entities.Professional
import com.example.analytics.entities.Skill
import com.example.analytics.services.ProfessionalEmployment


data class ProfessionalDTO(
    val professionalId: Long,
    val employment: ProfessionalEmployment,
    val geographicalInfo: String,
    val dailyRate : Double,
    val notes : String,
    //val contact: Contact?,
    val skills: MutableSet<Skill>
    )

fun Professional.toDto(): ProfessionalDTO =
    ProfessionalDTO(
        this.professionalId,
        this.employment,
        this.geographicalInfo,
        this.dailyRate,
        this.notes,
        //this.contact,
        this.skills)

