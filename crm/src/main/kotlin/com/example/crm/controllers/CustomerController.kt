package com.example.crm.controllers

import com.example.crm.services.CustomerServices
import com.example.crm.dtos.CustomerCreateDTO
import com.example.crm.dtos.CustomerDTO
import jakarta.validation.constraints.Positive
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/API/customers")
class CustomerController(private val customerServices : CustomerServices) {

    @GetMapping("", "/")
    fun getAllCustomers() : List<CustomerDTO> {
        return customerServices.getAllCustomers()
    }

    @GetMapping("/{id}", "/{id}/")
    fun getCustomerById(@PathVariable @Positive id: Long) : CustomerDTO {
        return customerServices.getCustomerById(id)
    }

    @PostMapping("", "/")
    @ResponseStatus(HttpStatus.CREATED)
    fun uploadCustomer(
        @RequestBody dto: CustomerCreateDTO
    ): CustomerDTO {
        return customerServices.create(dto)
    }

    @PutMapping("/notes/{id}", "/notes/{id}/")
    @ResponseStatus(HttpStatus.OK)
    fun addNote(
        @RequestParam note: String,
        @PathVariable @Positive id: Long
    ): CustomerDTO {
        return customerServices.addNote(id, note)
    }
}