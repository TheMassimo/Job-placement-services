package com.example.crm.services

import com.example.crm.dtos.CustomerCreateDTO
import com.example.crm.dtos.CustomerDTO
import com.example.crm.dtos.toDto
import com.example.crm.entities.Category
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
import org.springframework.transaction.annotation.Transactional

@Service
class CustomerServicesImpl(
    private val customerRepository: CustomerRepository,
    private val contactRepository: ContactRepository,
    private val contactServices: ContactServices
) : CustomerServices {

    private val logger: Logger = LoggerFactory.getLogger(CustomerServices::class.java)

    override fun getAllCustomers(): List<CustomerDTO> {
        return customerRepository.findAll().map { it.toDto() }
    }

    override fun getCustomerById(id: Long): CustomerDTO {
        val customer = customerRepository.findByIdOrNull(id)
            ?: throw CustomerNotFoundException("Customer id does not exist")
        return customer.toDto()
    }

    @Transactional
    override fun create(dto: CustomerCreateDTO): CustomerDTO {
        val c = Customer()
        val contact = contactRepository.findByIdOrNull(dto.contactId)
            ?: throw ContactNotFoundException("Contact id does not exist")
        logger.info("111")

        val existingCustomer = customerRepository.findByContact(contact)
        if (existingCustomer != null) {
            throw BadParameterException("A customer already exists for this contact")
        }

        c.addContact(contact)
        c.notes = dto.notes ?: ""

        // Salva prima il cliente
        val cDTO = customerRepository.save(c).toDto()

        // Solo dopo aggiorna la categoria del contatto
        contactServices.updateCategory(dto.contactId, Category.Customer)

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