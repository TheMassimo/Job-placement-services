package com.example.cm.controllers

import com.example.cm.dtos.GmailCreateDTO
import com.example.cm.dtos.GmailDTO
import com.example.cm.services.GmailServices
import org.apache.camel.CamelContext
import org.apache.camel.ProducerTemplate
import org.apache.camel.builder.ExchangeBuilder
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/API/emails")
class GmailController(private val gmailServices: GmailServices,
                      private val producerTemplate: ProducerTemplate,
                      private val camelContext: CamelContext) {

    private val logger = LoggerFactory.getLogger(GmailController::class.java)

    @GetMapping("/prova", "/prova/")
    fun justTry(): String{
        return "this is a test"
    }

    @GetMapping("", "/")
    fun getAllEmails(): List<GmailDTO>{
        return gmailServices.getAllEmails()
    }

    @PostMapping("/saveCopy", "/saveCopy/")
    fun uploadEmail(@RequestBody dto: GmailCreateDTO): GmailDTO{
        return gmailServices.uploadEmail(dto)
    }

    @PostMapping("", "/")
    fun sendToCRM(@RequestBody dto:GmailCreateDTO): String{
        logger.info("MASSIMO PROVA 123")
        val exchange = ExchangeBuilder.anExchange(camelContext)
            .withHeader("to", dto.receiver)
            .withHeader("subject", dto.subject)
            .withBody(dto.body)
            .build()
        producerTemplate.send("direct:sendEmails", exchange)
        return "Email inviata"
    }
}
