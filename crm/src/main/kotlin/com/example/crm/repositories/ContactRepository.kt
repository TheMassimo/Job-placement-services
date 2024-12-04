package com.example.crm.repositories

import com.example.crm.entities.Contact
import com.example.crm.entities.JobOffer
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository                              //Entity , Id
interface ContactRepository: JpaRepository<Contact, Long> {

    // Metodo per trovare tutti i Contact con customer non nullo
    @EntityGraph(attributePaths = ["customer"])
    fun findByCustomerIsNotNull(pageable: Pageable): Page<Contact>

    @EntityGraph(attributePaths = ["professional"])
    fun findByProfessionalIsNotNull(pageable: Pageable): Page<Contact>

    fun existsBySsn(ssn: String): Boolean
}