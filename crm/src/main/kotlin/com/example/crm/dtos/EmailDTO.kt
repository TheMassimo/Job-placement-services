package com.example.crm.dtos

import com.example.crm.entities.Email

data class EmailDTO (
    val emailId: Long,
    val email: String
)

fun Email.toDto(): EmailDTO =
    EmailDTO(
        this.emailId,
        this.email
    )