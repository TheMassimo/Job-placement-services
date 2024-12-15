package com.example.analytics.dtos

import com.example.analytics.entities.Contact

data class ContactDTO (
    val contactId: Long,
    val name: String,
    val surname: String,
    val category: String,
    val email: List<EmailDTO>,
    val address: List<AddressDTO>,
    val ssnCode: String,
    val telephone: List<TelephoneDTO>
)

fun Contact.toDto(): ContactDTO =
    ContactDTO(
        this.contactId,
        this.name,
        this.surname,
        this.category,
        this.email.map {it.toDto()},
        this.address.map { it.toDto() },
        this.ssnCode,
        this.telephone.map { it.toDto() }
    )