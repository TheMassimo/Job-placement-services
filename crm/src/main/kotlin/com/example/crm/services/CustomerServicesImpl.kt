package com.example.crm.services

import com.example.crm.dtos.CustomerCreateDTO
import com.example.crm.dtos.CustomerDTO
import com.example.crm.dtos.toDto
import com.example.crm.entities.Customer
import com.example.crm.exeptions.BadParameterException
import com.example.crm.exeptions.ContactNotFoundException
import com.example.crm.exeptions.CustomerNotFoundException
import com.example.crm.repositories.ContactRepository
import com.example.crm.repositories.CustomerRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class CustomerServicesImpl(private val customerRepository: CustomerRepository, private val contactRepository: ContactRepository) : CustomerServices {

    private val logger: Logger = LoggerFactory.getLogger(CustomerServices::class.java)

    override fun getAllCustomers(): List<CustomerDTO> {
        return customerRepository.findAll().map { it.toDto() }
    }

    override fun getCustomerById(id: Long): CustomerDTO {
        val customer = customerRepository.findByIdOrNull(id)
            ?: throw CustomerNotFoundException("Customer id does not exist")
        return customer.toDto()
    }

    override fun create(dto: CustomerCreateDTO): CustomerDTO {
        val c = Customer()
        val contact = contactRepository.findByIdOrNull(dto.contactId)
            ?: throw ContactNotFoundException("Contact id does not exist")

        if (customerRepository.findByContact(contact) != null){
            throw BadParameterException("A customer already exists for this contact")
        }

        c.addContact(contact)



        //contactRepository.save(contact)
        c.notes = dto.notes?:""


        val cDTO = customerRepository.save(c).toDto()
        logger.info("Customer successfully created")

        return cDTO
    }

    override fun addNote(id: Long,note: String): CustomerDTO {
        val customer = customerRepository.findByIdOrNull(id)
            ?: throw CustomerNotFoundException("customerid not found")

        customer.notes = note

        customerRepository.save(customer)

        logger.info("Note successfully created")
        return customer.toDto()
    }


}