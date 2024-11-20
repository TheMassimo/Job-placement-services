package com.example.crm.controllers

import com.example.crm.dtos.MessageCreateDTO
import com.example.crm.dtos.MachineStateDTO
import com.example.crm.dtos.MessageDTO
import com.example.crm.services.MessageServices
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.Positive
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/API/messages")
class MessageController(private val messageServices: MessageServices) {

    @GetMapping("", "/")
    fun getAllMessages(
        @RequestParam("page", defaultValue = "0") @Min(value = 0) page: Int,
        @RequestParam("limit", defaultValue = "10") @Min(value = 1) limit: Int,
        @RequestParam(defaultValue = "NOT SORTED") sorted: String,
        @RequestParam(defaultValue = "NOT FILTERED") filtered: String
    ): ResponseEntity<List<MessageDTO>> {
        val messages = messageServices.getAllMessages(page, limit, sorted, filtered)
        return ResponseEntity.ok(messages)
    }

    @PostMapping("", "/")
    @ResponseStatus(HttpStatus.CREATED)
    fun uploadMessage(
        @RequestBody dto: MessageCreateDTO)
      : MessageDTO {
        return messageServices.create(dto)
    }

    @GetMapping("/{id}", "/{id}/")
    fun getMessage(@PathVariable @Positive id: Long): MessageDTO {
        val message = messageServices.getMessage(id)
        return message
    }

    @PostMapping("/{id}", "/{id}/")
    fun updateState(@PathVariable @Positive id: Long,
                    @RequestParam state: String,
                    @RequestParam(required = false, defaultValue = "") comment: String): MessageDTO{
        val message = messageServices.updateState(id, state, comment)
        return message
    }

    @GetMapping("/{id}/history", "/{id}/history/")
    fun getHistory(@PathVariable @Positive id: Long) : List<MachineStateDTO>{
        return messageServices.getHistory(id)
    }

    @PutMapping("/{id}/priority", "/{id}/priority/")
    fun updatePriority(@PathVariable @Positive id: Long, @RequestParam priority: Int): MessageDTO{
        return messageServices.updatePriority(id, priority)
    }

    //con optimistic locking dovrei avere il dto per sapere la versione del dto
}