package com.example.analytics.repositories

import com.example.analytics.entities.Contact
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository                              //Entity , Id
interface ContactRepository: JpaRepository<Contact, Long> {
}