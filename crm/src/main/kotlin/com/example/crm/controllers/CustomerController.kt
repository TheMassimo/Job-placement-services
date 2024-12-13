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

    @DeleteMapping("/{id}")
    //@PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_manager', 'ROLE_recruiter')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteCustomer(
        @PathVariable("id", required = true) customerId: Long
    ) {
        customerServices.deleteCustomer(customerId)
    }

    @PostMapping("", "/")
    @ResponseStatus(HttpStatus.CREATED)
    fun uploadCustomer(
        @RequestBody dto: CustomerCreateDTO
    ): CustomerDTO {
        return customerServices.create(dto)
    }

    @PutMapping("/note/{id}", "/note/{id}/")
    @ResponseStatus(HttpStatus.OK)
    fun updateNote(
        @PathVariable @Positive id: Long,
        @RequestBody note: String
    ): CustomerDTO {
        return customerServices.updateNote(id, note)
    }
}