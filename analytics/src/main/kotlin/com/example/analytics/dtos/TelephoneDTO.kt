package com.example.analytics.dtos
import com.example.analytics.entities.Telephone

data class TelephoneDTO (
    val telephoneId: Long,
    val telephone: String
)

fun Telephone.toDto(): TelephoneDTO =
    TelephoneDTO(
        this.telephoneId,
        this.telephone
    )