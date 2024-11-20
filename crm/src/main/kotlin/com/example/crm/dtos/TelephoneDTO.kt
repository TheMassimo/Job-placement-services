package com.example.crm.dtos
import com.example.crm.entities.Telephone

data class TelephoneDTO (
    val telephoneId: Long,
    val telephone: String
)

fun Telephone.toDto(): TelephoneDTO =
    TelephoneDTO(
        this.telephoneId,
        this.telephone
    )