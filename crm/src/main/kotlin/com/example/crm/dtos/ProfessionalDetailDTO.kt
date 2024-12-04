package com.example.crm.dtos

import com.example.crm.entities.Category
import com.example.crm.entities.Contact
import com.example.crm.entities.ProfessionalEmployment

data class ProfessionalDetailDTO (
    val contactId: Long,
    val name: String,
    val surname: String,
    val category: Category,
    val email: List<EmailDTO>,
    val address: List<AddressDTO>,
    val ssn: String,
    val telephone: List<TelephoneDTO>,
    val employment: ProfessionalEmployment,
    val dailyRate: Double,
    val skills: List<SkillDTO>,
    val notes : String?,
)