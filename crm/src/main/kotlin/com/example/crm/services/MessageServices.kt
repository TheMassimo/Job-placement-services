package com.example.crm.services

import com.example.crm.dtos.MessageCreateDTO
import com.example.crm.dtos.MachineStateDTO
import com.example.crm.dtos.MessageDTO

interface MessageServices {
    fun getAllMessages(page: Int, limit: Int, sorted: String, filtered: String): List<MessageDTO>

    fun create(dto: MessageCreateDTO): MessageDTO

    fun getMessage(id: Long) : MessageDTO

    fun updateState(id: Long, state: String, comment: String) : MessageDTO

    fun getHistory(id: Long) : List<MachineStateDTO>

    fun updatePriority(id: Long, priority: Int) : MessageDTO
}