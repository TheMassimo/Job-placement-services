package com.example.crm.dtos

import com.example.crm.entities.Professional
import com.example.crm.entities.Skill
import com.example.crm.services.ProfessionalEmployment


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

