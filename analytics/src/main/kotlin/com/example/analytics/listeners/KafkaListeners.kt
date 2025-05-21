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

    @KafkaListener(id = "contact_listener_id", topics = ["kafka_postgres_.public.contact"], groupId="analytics")
    fun contactListener(message: String){

        val kafkaMessage: KafkaMessageDTO<ContactAnalyticsDTO> = jacksonObjectMapper().readValue(message)

        if (kafkaMessage.op == "c") {
            logger.info("new contact ${kafkaMessage.after} has been created")
        }
        if (kafkaMessage.op == "d") {
            logger.info("contact ${kafkaMessage.after} has been deleted")
        }
    }

    @KafkaListener(id = "jobOffer_listener_id", topics = ["kafka_postgres_.public.job_offer"], groupId="analytics")
    fun jobOfferListener(message: String){

        val kafkaMessage: KafkaMessageDTO<JobOfferAnalyticsDTO> = jacksonObjectMapper().readValue(message)

        logger.info("\n---\n\nNew kafka message: $kafkaMessage \n\n---")

        if (kafkaMessage.op == "c") {
            try {
                analyticsServices.storeJobOffer(kafkaMessage.after)
            }
            catch (e: Exception) {
                logger.info("error while creating job offer: $e")
            }
            finally {
                logger.info("job offer ${kafkaMessage.after} has been created")
            }
        }

        if (kafkaMessage.op == "d") {
            try {
                analyticsServices.deleteJobOffer(kafkaMessage.before)
            }
            catch (e: Exception) {
                logger.info("error while deleting job offer: $e")
            }
            finally {
                logger.info("job offer ${kafkaMessage.before} has been deleted")
            }
        }

        if (kafkaMessage.op == "u") {
            try {
                analyticsServices.updateJobOffer(kafkaMessage.after)
            }
            catch (e: Exception) {
                logger.info("error while updating job offer: $e")
            }
            finally {
                logger.info("job offer ${kafkaMessage.after} has been updated")
            }
        }
    }

    @KafkaListener(id = "customer_listener_id", topics = ["kafka_postgres_.public.customer"], groupId="analytics")
    fun customerListener(message: String){

        val kafkaMessage: KafkaMessageDTO<CustomerAnalyticsDTO> = jacksonObjectMapper().readValue(message)

        if (kafkaMessage.op == "c") {
            logger.info("new customer ${kafkaMessage.after} has been created")
        }
        if (kafkaMessage.op == "d") {
            logger.info("customer ${kafkaMessage.after} has been deleted")
        }
    }

    @KafkaListener(id = "professional_listener_id", topics = ["kafka_postgres_.public.professional"], groupId="analytics")
    fun professionalListener(message: String){

        val kafkaMessage: KafkaMessageDTO<ProfessionalAnalyticsDTO> = jacksonObjectMapper().readValue(message)

        //logger.info("\n---\n\nNew kafka message: $kafkaMessage \n\n---")

        if (kafkaMessage.op == "c" && kafkaMessage.after?.geographical_info != null) {
            try {
                //analyticsServices.storeLocation(kafkaMessage.after.geographical_info, kafkaMessage.after.professional_id)
            }
            catch (e: Exception) {
                logger.info("error while creating professional location: $e")
            }
            finally {
                logger.info("professional location ${kafkaMessage.after} has been created")
            }
        }

        if (kafkaMessage.op == "d" && kafkaMessage.before?.professional_id != null) {
            try {
                //analyticsServices.deleteOrReduceLocation(kafkaMessage.before.professional_id)
            }
            catch (e: Exception) {
                logger.info("error while deleting professional location: $e")
            }
            finally {
                logger.info("professional location ${kafkaMessage.before} has been deleted")
            }
        }
    }

    @KafkaListener(id = "skill_listener_id", topics = ["kafka_postgres_.public.skill"], groupId="analytics")
    fun skillListener(message: String){

        val kafkaMessage: KafkaMessageDTO<SkillAnalyticsDTO> = jacksonObjectMapper().readValue(message)

        if (kafkaMessage.op == "c") {
            logger.info("new skill ${kafkaMessage.after} has been created")
        }
        if (kafkaMessage.op == "d") {
            logger.info("skill ${kafkaMessage.after} has been deleted")
        }
    }
}