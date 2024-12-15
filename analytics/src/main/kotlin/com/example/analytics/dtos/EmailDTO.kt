package com.example.analytics.dtos

import com.example.analytics.entities.Email

data class EmailDTO (
    val emailId: Long,
    val email: String
)

fun Email.toDto(): EmailDTO =
    EmailDTO(
        this.emailId,
        this.email
    )