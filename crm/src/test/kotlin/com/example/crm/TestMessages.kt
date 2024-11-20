package com.example.crm

import com.example.crm.services.MessageServices
import com.example.crm.dtos.MessageCreateDTO
import jakarta.transaction.Transactional
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql

class TestMessages: IntegrationTest() {
    @Autowired
    private lateinit var messageServices: MessageServices

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldGetAllMessages() {
        val messageList = messageServices.getAllMessages(0, 100, "NOT SORTED", "NOT FILTERED")

        assert(messageList.isNotEmpty())
        assert(messageList[0].messageId == 1L)
        assert(messageList[1].messageId == 2L)
        assert(messageList[2].messageId == 3L)
    }

    @Test
    @Transactional
    @Rollback
    fun shouldCreateMessage() {
        val newMessage = messageServices.create(MessageCreateDTO(
            "Sender",
            "Subject",
            "Body",
            "Channel"
        ))
        val messageList = messageServices.getAllMessages(0, 100, "NOT SORTED", "NOT FILTERED")

        assert(messageList.size == 1)
        assert(messageList[0] == newMessage)
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldGetMessageById() {
        val firstMessageById = messageServices.getMessage(1L)
        val secondMessageById = messageServices.getMessage(2L)
        val thirdMessageById = messageServices.getMessage(3L)

        assert(firstMessageById.body == "this is the first message body")
        assert(secondMessageById.body == "this is the second message body")
        assert(thirdMessageById.body == "this is the third message body")
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldChangeMessageState() {
        val updatedMessage = messageServices.updateState(1L, "Read", "Comment")

        assert(updatedMessage.state == "READ")
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldGetMessageHistory() {
        messageServices.updateState(1L, "Read", "Comment")
        val messageHistory = messageServices.getHistory(1L)

        assert(messageHistory.isNotEmpty())
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldChangeMessagePriority() {
        val updatedMessage = messageServices.updatePriority(1L, 99)

        assert(updatedMessage.priority == 99)
    }
}