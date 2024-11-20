package com.example.crm.dtos

data class MessageCreateDTO(
                            val sender: String,
                            val subject: String?,
                            val body: String?,
                            val channel: String)

