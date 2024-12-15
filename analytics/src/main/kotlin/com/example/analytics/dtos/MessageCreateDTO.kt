package com.example.analytics.dtos

data class MessageCreateDTO(
                            val sender: String,
                            val subject: String?,
                            val body: String?,
                            val channel: String)

