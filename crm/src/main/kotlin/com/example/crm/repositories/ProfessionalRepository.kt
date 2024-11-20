package com.example.crm.repositories

import com.example.crm.entities.Contact
import com.example.crm.entities.Professional
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository                                      //Entity   , Id
interface ProfessionalRepository: JpaRepository<Professional, Long> {
    fun findByContact(contact: Contact): Professional?
}