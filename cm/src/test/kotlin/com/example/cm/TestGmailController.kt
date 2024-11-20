package com.example.cm

import com.example.cm.dtos.GmailCreateDTO
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post

@AutoConfigureMockMvc
class TestGmailController: IntegrationTest() {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @Test
    fun shouldGetAllEmails() {
        mockMvc.get("/API/emails")
            .andExpect {
                status { isOk() }
                content { contentType(MediaType.APPLICATION_JSON) }
            }
    }

    @Test
    fun shouldUploadEmail() {
        val newEmail = GmailCreateDTO("receiver@gmail.com", "we sent this", "new subject", "new body", "email")
        mockMvc.post("/API/emails/saveCopy") {
            contentType = MediaType.APPLICATION_JSON
            content = jacksonObjectMapper().writeValueAsString(newEmail)
            accept = MediaType.APPLICATION_JSON
        }
            .andExpect {
                status { isOk() }
                content { contentType(MediaType.APPLICATION_JSON) }
                content { json("""{"receiver":"receiver@gmail.com","sender":"we sent this","subject":"new subject","body":"new body","channel":"email"}""") }
            }
    }

    @Test
    fun shouldSendEmail() {
        val newEmail = GmailCreateDTO("receiver@gmail.com", "we sent this", "new subject", "new body", "email")
        mockMvc.post("/API/emails") {
            contentType = MediaType.APPLICATION_JSON
            content = jacksonObjectMapper().writeValueAsString(newEmail)
            accept = MediaType.APPLICATION_JSON
        }
            .andExpect {
                status { isOk() }
                content { contentType(MediaType.APPLICATION_JSON) }
                content { string("Email inviata") }
            }
    }
}