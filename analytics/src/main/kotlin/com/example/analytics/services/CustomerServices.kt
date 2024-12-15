package com.example.analytics.services

import com.example.analytics.dtos.CustomerCreateDTO
import com.example.analytics.dtos.CustomerDTO

interface CustomerServices {

    fun getAllCustomers(): List<CustomerDTO>
    fun getCustomerById(id: Long): CustomerDTO

    fun create(dto: CustomerCreateDTO) : CustomerDTO

    fun addNote(id: Long, note: String): CustomerDTO
}