package com.example.crm.repositories

import com.example.crm.entities.Email
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface EmailRepository: JpaRepository<Email, Long> {
    fun findIdByEmail(email: String): Email?
}