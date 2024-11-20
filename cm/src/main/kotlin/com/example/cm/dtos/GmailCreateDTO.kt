package com.example.cm.dtos

data class GmailCreateDTO(
    val receiver: String?,
    val sender: String?,
    val subject: String,
    val body: String,
    var channel: String?
)