package com.example.analytics.repositories

import com.example.analytics.entities.Contact
import com.example.analytics.entities.Customer
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CustomerRepository: JpaRepository<Customer, Long> {

    fun findByContact(contact: Contact): Customer?


}