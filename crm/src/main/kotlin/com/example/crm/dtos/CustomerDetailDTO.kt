package com.example.crm.dtos

import com.example.crm.entities.Category

data class CustomerDetailDTO (
    val contactId: Long,
    val name: String,
    val surname: String,
    val category: Category,
    val email: List<EmailDTO>,
    val address: List<AddressDTO>,
    val ssnCode: String,
    val telephone: List<TelephoneDTO>,
    val notes : String?,
    val jobOffers: List<JobOfferDTO>,
)