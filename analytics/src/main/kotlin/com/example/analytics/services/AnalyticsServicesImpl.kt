package com.example.analytics.services

import com.example.analytics.analytics_dtos.*
import com.example.analytics.entities.JobOfferAnalytics
import com.example.analytics.entities.Location
import com.example.analytics.entities.SkillOccurrence
import com.example.analytics.exeptions.BadParameterException
import com.example.analytics.repositories.JobOfferAnalyticsRepository
import com.example.analytics.repositories.LocationRepository
import com.example.analytics.repositories.SkillOccurrenceRepository
import jakarta.persistence.EntityManager
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service

@Service
class AnalyticsServicesImpl(private val entityManager: EntityManager,
                            private val skillOccurrenceRepository: SkillOccurrenceRepository,
                            private val jobOfferAnalyticsRepository: JobOfferAnalyticsRepository,
                            private val locationRepository: LocationRepository
): AnalyticsServices {

    private val logger: Logger = LoggerFactory.getLogger(AnalyticsServicesImpl::class.java)

    override fun getRequiredSkillsList(): List<SkillRepetitionsDTO>{
        TODO("Not yet implemented")
    }

    override fun addSkillRequirement(jobOfferId: Long, skill: String) {

        //check if a skill with the same name and jobOfferId already exists
        if (skillOccurrenceRepository.findIdByJobOfferIdAndSkill(jobOfferId, skill) != null) {
            logger.error("skill '${skill}' already exists for job offer '${jobOfferId}'")
            throw BadParameterException("skill '${skill}' already exists for job offer '${jobOfferId}'")
        }

        // create the new skill occurrence
        val eSkillOccurrence = SkillOccurrence()
        eSkillOccurrence.skill = skill
        eSkillOccurrence.jobOfferId = jobOfferId

        skillOccurrenceRepository.save(eSkillOccurrence)
        logger.info("skill occurrence successfully created")
    }

    override fun deleteSkillRequirement(jobOfferId: Long, skills: List<String>) {

        for (skill in skills){
            //check if skill occurrence exist
            val eSkillOccurrence = skillOccurrenceRepository.findIdByJobOfferIdAndSkill(jobOfferId, skill)
                ?: throw BadParameterException("skill occurrence not found")

            //delete the skill occurrence
            skillOccurrenceRepository.delete(eSkillOccurrence)
            logger.info("skill occurrence successfully deleted")
        }
    }

    override fun storeJobOffer(jobOfferAnalyticsDTO: JobOfferAnalyticsDTO?) {

        if (jobOfferAnalyticsDTO != null) {
            val eJobOfferAnalytics = JobOfferAnalytics()
            eJobOfferAnalytics.offerValue = jobOfferAnalyticsDTO.offer_value
            eJobOfferAnalytics.duration = jobOfferAnalyticsDTO.duration
            eJobOfferAnalytics.status = jobOfferAnalyticsDTO.status

            jobOfferAnalyticsRepository.save(eJobOfferAnalytics)
            logger.info("job Offer Analytics successfully created")
        }
        else{
            throw BadParameterException("jobOfferAnalyticsDTO not found")
        }
    }

    override fun getAverageJobOfferValue(): Double? {
        val count = jobOfferAnalyticsRepository.findAll().size
        return jobOfferAnalyticsRepository.findAll().sumOf { it.offerValue } / count
    }

    override fun getAverageJobOfferDuration(): Double? {
        val count = jobOfferAnalyticsRepository.findAll().size
        return jobOfferAnalyticsRepository.findAll().sumOf { it.duration } / count
    }

    override fun storeLocation(location: String) {
        // check if the given location already exists,
        // if no add it with 1 professional, if yes, increase its professional field by 1
        val locationId = locationRepository.findIdByLocation(location)
        if (locationId == null){
            val eLocation = Location()
            eLocation.location = location
            eLocation.professionals = 1

            locationRepository.save(eLocation)
            logger.info("new Location successfully created")
        }
        else{
            val eLocation = Location()
            eLocation.professionals += 1

            locationRepository.save(eLocation)
            logger.info("Location population successfully updated")
        }
    }

    override fun getLocationsList(): List<LocationDTO> {
        val locationsList = locationRepository.findAll().map { it.toDto() }.sortedBy { it.professionals }
        return locationsList
    }
}