package com.example.analytics.dtos

import com.example.analytics.entities.Customer


data class CustomerDTO(
    val customerId: Long,
    //val contact : Contact?,
    val notes : String?,
    val jobOffers: List<JobOfferDTO>,
    val replacementHistory : List<JobOfferDTO>


)

fun Customer.toDto(): CustomerDTO =
    CustomerDTO(this.customerId, /*this.contact, */ this.notes, this.jobOffers.map { it.toDto() }, this.replacementHistory.map { it.toDto() })