package com.example.cm.services

import com.example.cm.dtos.GmailCreateDTO
import com.example.cm.dtos.GmailDTO

interface GmailServices {

    fun getAllEmails(): List<GmailDTO>

    fun uploadEmail(gmailDTO: GmailCreateDTO): GmailDTO

    //fun deleteEmail(emailId: Long)
}