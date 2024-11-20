package com.example.crm.dtos

import com.example.crm.entities.Address

data class AddressDTO (
    val addressId: Long,
    val address: String
)

fun Address.toDto(): AddressDTO =
    AddressDTO(
        this.addressId,
        this.address
    )