package com.example.crm.dtos

import com.example.crm.entities.Contact

data class CustomerDetailsDTO (
    val contactId: Long,
    val name: String,
    val surname: String,
    val category: String,
    val email: List<EmailDTO>,
    val address: List<AddressDTO>,
    val ssnCode: String,
    val telephone: List<TelephoneDTO>,
    val notes : String?,
    val jobOffers: List<JobOfferDTO>,
)