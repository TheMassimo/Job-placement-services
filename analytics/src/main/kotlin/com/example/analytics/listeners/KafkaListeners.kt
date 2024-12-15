package com.example.analytics.listeners

import com.example.analytics.analytics_dtos.*
import com.example.analytics.services.AnalyticsServices
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.stereotype.Service

@Service
class KafkaListeners(private val analyticsServices: AnalyticsServices) {
    private val logger: Logger = LoggerFactory.getLogger(KafkaListeners::class.java)

    @KafkaListener(id = "jobOffer_listener_id", topics = ["kafka_postgres_.public.job_offer"], groupId="analytics")
    fun jobOfferListener(message: String){
        logger.info("kafka message for job offer received")
        logger.info(message)

        val kafkaMessage: KafkaMessageDTO<JobOfferAnalyticsDTO> = jacksonObjectMapper().readValue(message)

        if (kafkaMessage.op == "c") {
            logger.info("new job offer ${kafkaMessage.after} has been created, adding it to the analytics db")
            analyticsServices.storeJobOffer(kafkaMessage.after)


        }
        if (kafkaMessage.op == "d") {
            logger.info("job offer has been deleted, adding it to the analytics db")
        }
    }

    @KafkaListener(id = "customer_listener_id", topics = ["kafka_postgres_.public.customer"], groupId="analytics")
    fun customerListener(message: String){
        logger.info("kafka message for customer received")
        logger.info(message)

        val kafkaMessage: KafkaMessageDTO<CustomerAnalyticsDTO> = jacksonObjectMapper().readValue(message)
        print(kafkaMessage)

        val operation: String? = kafkaMessage.op
        logger.info(operation)

        if (operation == "c") {
            logger.info("new customer ${kafkaMessage.after} has been created, adding it to the analytics db")

        }
        if (operation == "d") {
            logger.info("customer has been deleted, adding it to the analytics db")
        }
    }

    @KafkaListener(id = "professional_listener_id", topics = ["kafka_postgres_.public.professional"], groupId="analytics")
    fun professionalListener(message: String){
        logger.info("kafka message for professional received")
        logger.info(message)

        val kafkaMessage: KafkaMessageDTO<ProfessionalAnalyticsDTO> = jacksonObjectMapper().readValue(message)
        print(kafkaMessage)

        val operation: String? = kafkaMessage.op
        logger.info(operation)

        if (operation == "c") {
            logger.info("new professional ${kafkaMessage.after} has been created, adding it to the analytics db")
        }
        if (operation == "d") {
            logger.info("professional has been deleted, removing it from the analytics db")
        }
    }

    @KafkaListener(id = "skill_listener_id", topics = ["kafka_postgres_.public.skill"], groupId="analytics")
    fun skillListener(message: String){
        logger.info("kafka message for skill received")
        logger.info(message)

        val kafkaMessage: KafkaMessageDTO<SkillAnalyticsDTO> = jacksonObjectMapper().readValue(message)
        print(kafkaMessage)

        val operation: String? = kafkaMessage.op
        logger.info(operation)

        if (operation == "c") {
            logger.info("new skill ${kafkaMessage.after} has been created, adding it to the analytics db")
        }
        if (operation == "d") {
            logger.info("skill has been deleted, removing it from the analytics db")
        }
    }
}