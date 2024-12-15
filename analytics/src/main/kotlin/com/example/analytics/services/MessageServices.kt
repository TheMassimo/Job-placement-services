package com.example.analytics.services

import com.example.analytics.dtos.MessageCreateDTO
import com.example.analytics.dtos.MachineStateDTO
import com.example.analytics.dtos.MessageDTO

interface MessageServices {
    fun getAllMessages(page: Int, limit: Int, sorted: String, filtered: String): List<MessageDTO>

    fun create(dto: MessageCreateDTO): MessageDTO

    fun getMessage(id: Long) : MessageDTO

    fun updateState(id: Long, state: String, comment: String) : MessageDTO

    fun getHistory(id: Long) : List<MachineStateDTO>

    fun updatePriority(id: Long, priority: Int) : MessageDTO
}