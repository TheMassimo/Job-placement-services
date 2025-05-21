package com.example.cm

import com.example.cm.dtos.GmailCreateDTO
import com.example.cm.services.GmailServices
import jakarta.mail.Session
import jakarta.mail.internet.InternetAddress
import jakarta.mail.internet.MimeMessage
import org.apache.camel.EndpointInject
import org.apache.camel.builder.RouteBuilder
import org.apache.camel.component.google.mail.GoogleMailEndpoint
import org.apache.camel.component.jackson.JacksonDataFormat
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.util.Base64



@Component
class MyRouteBuilder : RouteBuilder() {
    @EndpointInject("google-mail:messages/get")
    lateinit var ep: GoogleMailEndpoint

    private val logger: Logger = LoggerFactory.getLogger(GmailServices::class.java)

    override fun configure() {
        // Configura il formato JSON per EmailCreateDTO
        val messageCreateDTOFormat = JacksonDataFormat(GmailCreateDTO::class.java)

        // Fetch emails from Google Mail API endpoint
        from("google-mail-stream:0?markAsRead=true&scopes=https://mail.google.com")
            .routeId("fetchEmails")
            .process { exchange ->
                val id = exchange.`in`.getHeader("CamelGoogleMailId").toString()
                val message = ep.client.users().messages().get("me", id).execute()

                val subject = message.payload.headers
                    .find { it.name.equals("subject", true) }?.value ?: ""
                val from = message.payload.headers
                    .find { it.name.equals("from", true) }?.value ?: ""


                // Ottieni il corpo dell'email
                val textBody = if (message.payload.mimeType == "text/plain") {
                    String(Base64.getUrlDecoder().decode(message.payload.body.data))
                } else {
                    message.payload.parts?.find { it.mimeType == "text/plain" }?.let {
                        String(Base64.getUrlDecoder().decode(it.body.data))
                    } ?: "No text/plain part found"
                }

                logger.info("Received email subject: $subject")
                logger.info("Received email from: $from")
                logger.info("Received email body: $textBody")

                val newMessage = GmailCreateDTO(receiver="g29web2@gmail.com", sender =from, subject=subject, body=textBody, channel="Email")
                exchange.`in`.body = newMessage
            }
            .marshal(messageCreateDTOFormat) // Converte EmailCreateDTO in JSON
            .to("http://localhost:8083/API/emails/saveCopy") //to communication_manager end point
            .to("http://localhost:8081/API/messages/")       //to document_store end point

    }
}





@Component
class EmailSender : RouteBuilder() {
    @EndpointInject("google-mail:messages/send")
    lateinit var sendEp: GoogleMailEndpoint

    private val logger: Logger = LoggerFactory.getLogger(GmailServices::class.java)
    override fun configure() {
        val emailCreateDTOFormat = JacksonDataFormat(GmailCreateDTO::class.java)

        from("direct:sendEmails")
        //.unmarshal(gmailCreateDTOFormat)
        .process { exchange ->
            val email = exchange.`in`.headers

            val message = com.google.api.services.gmail.model.Message().apply {
                raw = createEmail(email.get("to").toString(), "me", email.get("subject").toString(), exchange.`in`.body.toString())
            }
            sendEp.client.users().messages().send("me", message).execute()
        }
    }
}

private fun createEmail(to: String, from: String, subject: String, bodyText: String): String {
    val props = System.getProperties()
    val session = Session.getDefaultInstance(props, null)

    val email = MimeMessage(session)
    email.setFrom(InternetAddress(from))
    email.addRecipient(jakarta.mail.Message.RecipientType.TO, InternetAddress(to))
    email.subject = subject

    val body = jakarta.mail.internet.MimeBodyPart()
    body.setText(bodyText)

    val multipart = jakarta.mail.internet.MimeMultipart()
    multipart.addBodyPart(body)

    email.setContent(multipart)

    val buffer = java.io.ByteArrayOutputStream()
    email.writeTo(buffer)
    return Base64.getUrlEncoder().encodeToString(buffer.toByteArray())
}

