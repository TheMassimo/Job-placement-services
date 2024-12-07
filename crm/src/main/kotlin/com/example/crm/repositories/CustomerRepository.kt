package com.example.crm.repositories

import com.example.crm.entities.Contact
import com.example.crm.entities.Customer
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CustomerRepository: JpaRepository<Customer, Long> {


    fun findByContact(contact: Contact): Customer?

}