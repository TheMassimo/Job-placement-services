package com.example.cm.services

import com.example.cm.dtos.GmailCreateDTO
import com.example.cm.dtos.GmailDTO
import com.example.cm.dtos.toDto
import com.example.cm.entities.Gmail
import com.example.cm.repositories.GmailRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class GmailServicesImpl(private val gmailRepository: GmailRepository):GmailServices {

    private val logger: Logger = LoggerFactory.getLogger(GmailServices::class.java)
    override fun getAllEmails(): List<GmailDTO> {
        return gmailRepository.findAll().map { it.toDto() }
    }

    override fun uploadEmail(gmailDTO: GmailCreateDTO): GmailDTO {
        val e = Gmail()

        e.receiver = gmailDTO.receiver ?: ""
        e.sender = gmailDTO.sender ?: ""
        e.subject = gmailDTO.subject
        e.body = gmailDTO.body
        e.channel = gmailDTO.channel ?: ""

        return gmailRepository.save(e).toDto()
    }

    /*
    override fun deleteEmail(emailId: Long) {
        TODO("Not yet implemented")
    }
    */


}