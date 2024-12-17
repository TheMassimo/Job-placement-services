package com.example.analytics.repositories

import com.example.analytics.entities.Location
import org.springframework.stereotype.Repository
import org.springframework.data.jpa.repository.JpaRepository

@Repository
interface LocationRepository: JpaRepository<Location, Long> {
    fun findByLocation(location: String): Location?
}
