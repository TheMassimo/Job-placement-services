package com.example.analytics.repositories

import com.example.analytics.entities.Telephone
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface TelephoneRepository: JpaRepository<Telephone, Long> {
    fun findIdByTelephone(telephone: String): Telephone?
}