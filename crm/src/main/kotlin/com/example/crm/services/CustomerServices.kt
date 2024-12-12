package com.example.crm.services

import com.example.crm.dtos.CustomerCreateDTO
import com.example.crm.dtos.CustomerDTO

interface CustomerServices {

    fun getAllCustomers(): List<CustomerDTO>
    fun getCustomerById(id: Long): CustomerDTO

    fun create(dto: CustomerCreateDTO) : CustomerDTO

    fun updateNote(id: Long, note: String): CustomerDTO
}