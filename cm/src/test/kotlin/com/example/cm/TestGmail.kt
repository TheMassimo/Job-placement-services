package com.example.cm

import com.example.cm.dtos.GmailCreateDTO
import com.example.cm.services.GmailServices
import jakarta.transaction.Transactional
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback

@SpringBootTest
class TestGmail: IntegrationTest() {
    @Autowired
    private lateinit var gmailServices: GmailServices

    @Test
    fun shouldGetAllEmails() {
        val emailList = gmailServices.getAllEmails()
        //assert(emailList.isNotEmpty())
    }

    @Test
    @Transactional
    @Rollback
    fun shouldUploadEmail() {
        var emailList = gmailServices.getAllEmails()
        val numEmails = emailList.size
        gmailServices.uploadEmail(GmailCreateDTO(
            "receiver@gmail.com",
            "test email sender (us)",
            "test email subject",
            "test email body",
            "email"
        ))
        emailList = gmailServices.getAllEmails()
        assert(emailList.isNotEmpty())
        assert(emailList.size == numEmails + 1)
    }
}