package com.example.cm.dtos

import com.example.cm.entities.Gmail

data class GmailDTO(
    val emailId: Long,
    val receiver: String,
    val sender: String,
    val subject: String,
    val body: String,
    val channel: String
)

fun Gmail.toDto(): GmailDTO =
    GmailDTO(
        this.emailId,
        this.receiver,
        this.sender,
        this.subject,
        this.body,
        this.channel
    )
