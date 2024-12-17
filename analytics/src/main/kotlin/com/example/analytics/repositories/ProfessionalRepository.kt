package com.example.analytics.repositories

import com.example.analytics.entities.Contact
import com.example.analytics.entities.Professional
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository                                      //Entity   , Id
interface ProfessionalRepository: JpaRepository<Professional, Long> {
    fun findByContact(contact: Contact): Professional?
}