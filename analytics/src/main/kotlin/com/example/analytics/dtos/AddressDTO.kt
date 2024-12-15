package com.example.analytics.dtos

import com.example.analytics.entities.Address

data class AddressDTO (
    val addressId: Long,
    val address: String
)

fun Address.toDto(): AddressDTO =
    AddressDTO(
        this.addressId,
        this.address
    )