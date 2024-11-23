package com.example.crm.dtos

import com.example.crm.entities.Message
import java.time.LocalDateTime

data class MessageDTO (
    val messageId: Long,

    val sender: String,
    val date: LocalDateTime,
    val subject: String,
    val body: String,
    val channel: String,
    val priority: Int,
    val state: String
    //val machineState: List<MachineStateDTO>
)

fun Message.toDto(): MessageDTO =
    MessageDTO(
        this.messageId,
        this.sender,
        this.date,
        this.subject,
        this.body,
        this.channel,
        this.priority,
        this.state.name
    )
