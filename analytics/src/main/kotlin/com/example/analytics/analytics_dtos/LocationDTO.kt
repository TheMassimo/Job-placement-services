package com.example.analytics.analytics_dtos

import com.example.analytics.entities.Location

data class LocationDTO (
    val locationId: Long,
    val location: String?,
    val professionalsCount: Int,
    val professionals: ArrayList<Long>?
)

fun Location.toDto(): LocationDTO =
    LocationDTO(
        this.locationId,
        this.location,
        this.professionalsCount,
        this.professionals
    )