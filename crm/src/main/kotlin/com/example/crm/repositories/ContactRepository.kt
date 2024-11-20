package com.example.crm.repositories

import com.example.crm.entities.Contact
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository                              //Entity , Id
interface ContactRepository: JpaRepository<Contact, Long> {
}