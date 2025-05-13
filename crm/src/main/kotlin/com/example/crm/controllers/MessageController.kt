package com.example.crm.controllers

import com.example.crm.dtos.MessageCreateDTO
import com.example.crm.dtos.MachineStateDTO
import com.example.crm.dtos.MessageDTO
import com.example.crm.services.MessageServices
import com.example.crm.services.State
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.Positive
import kotlinx.coroutines.channels.Channel
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/API/messages")
class MessageController(private val messageServices: MessageServices) {

    @GetMapping("", "/")
    fun getAllMessages(
        @RequestParam("sender", required = false) sender: String?,
        @RequestParam("channel", required = false) channel: String?,
        @RequestParam("state", required = false) state: State?,
        @RequestParam("pageNumber", required = false) @Min(
            value = 0,
            message = "Page number not valid, value must be great or equal to 0"
        ) pageNumber: Int = 0,
        @RequestParam("pageSize", required = false) @Min(
            value = 1,
            message = "Page size not valid, value must be great or equal to 1"
        ) pageSize: Int = 20,
    ): ResponseEntity<List<MessageDTO>> {
        val messages = messageServices.getAllMessages(sender, channel, state, pageNumber, pageSize);
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

    @PutMapping("/{id}", "/{id}/")
    fun updateState(@PathVariable @Positive id: Long,
                    @RequestBody state: String): MessageDTO{
        val message = messageServices.updateState(id, state, "")
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