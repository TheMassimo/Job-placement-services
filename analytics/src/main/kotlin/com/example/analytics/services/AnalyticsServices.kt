package com.example.analytics.services

import com.example.analytics.analytics_dtos.JobOfferAnalyticsDTO
import com.example.analytics.analytics_dtos.LocationDTO
import com.example.analytics.analytics_dtos.SkillOccurrenceDTO
import com.example.analytics.analytics_dtos.SkillRepetitionsDTO
import com.example.analytics.dtos.*

interface AnalyticsServices {

    fun getRequiredSkillsList(): List<SkillRepetitionsDTO>

    fun addSkillRequirement(jobOfferId: Long, skill: String)

    fun deleteSkillRequirement(jobOfferId: Long, skills: List<String>)

    fun storeJobOffer(jobOfferAnalyticsDTO: JobOfferAnalyticsDTO?)

    fun getAverageJobOfferValue(): Double?

    fun getAverageJobOfferDuration(): Double?

    fun storeLocation(location: String)

    fun getLocationsList(): List<LocationDTO>
}