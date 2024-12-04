package com.example.crm.dtos

import com.example.crm.entities.Category
import com.example.crm.entities.Contact

data class ContactDetailsDTO (
    val contactId: Long,
    val name: String,
    val surname: String,
    val category: Category,
    val email: List<EmailDTO>,
    val address: List<AddressDTO>,
    val ssn: String,
    val telephone: List<TelephoneDTO>,
    val customer: CustomerDTO?,
    val professional: ProfessionalDTO?
)

fun Contact.toDetailsDto(): ContactDetailsDTO =
    ContactDetailsDTO(
        this.contactId,
        this.name,
        this.surname,
        this.category,
        this.email.map {it.toDto()},
        this.address.map { it.toDto() },
        this.ssn,
        this.telephone.map { it.toDto() },
        this.customer?.toDto(),
        this.professional?.toDto()
    )