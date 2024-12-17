package com.example.analytics.controllers

import com.example.analytics.analytics_dtos.LocationDTO
import com.example.analytics.analytics_dtos.SkillRepetitionsDTO
import com.example.analytics.services.AnalyticsServices
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/API/analytics")
class AnalyticsController(private val analyticsServices: AnalyticsServices) {

    @GetMapping("/skills", "/skills/")
    fun getRequiredSkillsList() : ResponseEntity<List<SkillRepetitionsDTO>> {
        val skillRepetitionsList = analyticsServices.getRequiredSkillsList()
        return ResponseEntity.ok(skillRepetitionsList)
    }

    @GetMapping("/JobOfferValue", "/JobOfferValue/")
    fun getAverageJobOfferValue() : ResponseEntity<Double> {
        val averageValue = analyticsServices.getAverageJobOfferValue()
        return ResponseEntity.ok(averageValue)
    }

    @GetMapping("/JobOfferDuration", "/JobOfferDuration/")
    fun getAverageJobOfferDuration() : ResponseEntity<Double> {
        val averageDuration = analyticsServices.getAverageJobOfferDuration()
        return ResponseEntity.ok(averageDuration)
    }

    @GetMapping("/locations", "/locations/")
    fun getLocations() : ResponseEntity<List<LocationDTO>> {
        val locationsList = analyticsServices.getLocationsList()
        return ResponseEntity.ok(locationsList)
    }
}