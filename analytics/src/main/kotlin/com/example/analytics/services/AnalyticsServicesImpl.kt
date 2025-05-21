package com.example.analytics.services

import com.example.analytics.analytics_dtos.*
import com.example.analytics.entities.JobOfferAnalytics
import com.example.analytics.entities.Location
import com.example.analytics.entities.SkillOccurrence
import com.example.analytics.exeptions.BadParameterException
import com.example.analytics.repositories.JobOfferAnalyticsRepository
import com.example.analytics.repositories.LocationRepository
import com.example.analytics.repositories.SkillOccurrenceRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class AnalyticsServicesImpl(private val skillOccurrenceRepository: SkillOccurrenceRepository,
                            private val jobOfferAnalyticsRepository: JobOfferAnalyticsRepository,
                            private val locationRepository: LocationRepository
): AnalyticsServices {

    private val logger: Logger = LoggerFactory.getLogger(AnalyticsServicesImpl::class.java)

    override fun storeJobOffer(jobOfferAnalyticsDTO: JobOfferAnalyticsDTO?) {

        if (jobOfferAnalyticsDTO != null) {
            val eJobOfferAnalytics = JobOfferAnalytics()
            eJobOfferAnalytics.jobOfferId = jobOfferAnalyticsDTO.job_offer_id
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

    override fun deleteJobOffer(jobOfferAnalyticsDTO: JobOfferAnalyticsDTO?) {

        //check if job Offer exists
        val eJobOfferAnalytics = jobOfferAnalyticsDTO?.let { jobOfferAnalyticsRepository.findByJobOfferId(it.job_offer_id) }
            ?: throw BadParameterException("job Offer not found")

        try {
            jobOfferAnalyticsRepository.delete(eJobOfferAnalytics)
        } catch (e: Exception) {
            throw Exception("Error occurred while deleting job offer from analytics")
        }
        logger.info("job Offer Analytics successfully deleted")
    }

    override fun updateJobOffer(jobOfferAnalyticsDTO: JobOfferAnalyticsDTO?) {

        //check if job Offer exists
        val eJobOfferAnalytics = jobOfferAnalyticsDTO?.let { jobOfferAnalyticsRepository.findByJobOfferId(it.job_offer_id) }
            ?: throw BadParameterException("job Offer not found")

        eJobOfferAnalytics.offerValue = jobOfferAnalyticsDTO.offer_value
        eJobOfferAnalytics.duration = jobOfferAnalyticsDTO.duration
        eJobOfferAnalytics.status = jobOfferAnalyticsDTO.status

        jobOfferAnalyticsRepository.save(eJobOfferAnalytics)
        logger.info("job Offer Analytics successfully updated")
    }

    override fun getAverageJobOfferValue(): Double? {
        val count = jobOfferAnalyticsRepository.findAll().size
        return jobOfferAnalyticsRepository.findAll().sumOf { it.offerValue } / count
    }

    override fun getAverageJobOfferDuration(): Double? {
        val count = jobOfferAnalyticsRepository.findAll().size
        return jobOfferAnalyticsRepository.findAll().sumOf { it.duration } / count
    }

    override fun getJobOfferMinMaxValue(): List<Double> {
        val jobOffersMin = jobOfferAnalyticsRepository.findAll().minOf { it.offerValue }
        val jobOffersMax = jobOfferAnalyticsRepository.findAll().maxOf { it.offerValue }
        return listOf(jobOffersMin, jobOffersMax)
    }

    override fun getAverageJobOfferMonthlyValue(): Double? {
        val count = jobOfferAnalyticsRepository.findAll().size
        return jobOfferAnalyticsRepository.findAll().sumOf { it.offerValue / it.duration } / count
    }

    override fun storeLocation(location: String, professionalId: Long) {
        // check if the given location already exists,
        // if no add it with 1 professional, if yes, increase its professional field by 1 (and add the professional id)
        val existingLocation = locationRepository.findByLocation(location)
        logger.info("existingLocation: $existingLocation \n\n----")
        if (existingLocation == null){
            val eLocation = Location()
            eLocation.location = location
            eLocation.professionals.add(professionalId)
            eLocation.professionalsCount = 1

            try {
                locationRepository.save(eLocation)
            } catch (e : Exception) {
                logger.info("error creating new location")
            } finally {
                logger.info("new Location ${eLocation.location} successfully created")
            }
        }
        else{
            existingLocation.professionals.add(professionalId)
            existingLocation.professionalsCount += 1

            locationRepository.save(existingLocation)
            logger.info("Location ${existingLocation.location} successfully updated")
        }
    }

    override fun deleteOrReduceLocation(professionalId: Long) {
        //TODO
    }

    override fun getLocationsList(numLocations: Int): List<LocationDTO> {
        val locationsList = locationRepository.findAll().map { it.toDto() }
        //logger.info("\n----\n\n locations list: $locationsList \n\n----")
        val topLocations = locationsList.take(numLocations)
        //logger.info("Showing the top $numLocations locations by number of professionals")
        return topLocations
    }

    /*
    override fun getRequiredSkillsList(): List<SkillRepetitionsDTO>{

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
    }*/
}