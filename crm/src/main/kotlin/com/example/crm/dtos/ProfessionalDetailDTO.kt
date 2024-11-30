package com.example.crm.dtos

import com.example.crm.entities.Contact
import com.example.crm.services.ProfessionalEmployment

data class ProfessionalDetailDTO (
    val contactId: Long,
    val name: String,
    val surname: String,
    val category: String,
    val email: List<EmailDTO>,
    val address: List<AddressDTO>,
    val ssnCode: String,
    val telephone: List<TelephoneDTO>,
    val employment: ProfessionalEmployment,
    val dailyRate: Double,
    val skills: List<SkillDTO>,
    val notes : String?,

)