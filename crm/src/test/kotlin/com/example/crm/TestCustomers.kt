package com.example.crm

import com.example.crm.dtos.CustomerCreateDTO
import com.example.crm.services.CustomerServices
import jakarta.transaction.Transactional
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql

class TestCustomers: IntegrationTest() {
    @Autowired
    private lateinit var customerServices: CustomerServices



    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldGetAllCustomers() {
        val customerList = customerServices.getAllCustomers()

        assert(customerList.isNotEmpty())
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldGetCustomerById(){
        val customerList = customerServices.getAllCustomers()
        val customerId = customerList[0].customerId
        val customer = customerServices.getCustomerById(customerId)

        assert(customer in customerList)
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldCreateCustomer(){
        val newCustomer = customerServices.create(CustomerCreateDTO(
            5,
            "this is a pretty note",
        ))

        val customerList = customerServices.getAllCustomers()
        val customer = customerServices.getCustomerById(newCustomer.customerId)

        assert(customer.notes == "this is a pretty note")
        assert(customer in customerList)
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldAddNoteToCustomer(){
        val customerList = customerServices.getAllCustomers()
        val customerId = customerList[0].customerId

        customerServices.addNote(customerId, "a new note")
        val customer = customerServices.getCustomerById(customerId)

        assert(customer.notes == "a new note")
    }

}