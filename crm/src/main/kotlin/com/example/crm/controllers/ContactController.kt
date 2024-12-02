package com.example.crm.controllers

import com.example.crm.dtos.*
import com.example.crm.entities.Category
import com.example.crm.services.ContactServices
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.Positive
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/API/contacts")
class ContactController(private val contactServices: ContactServices) {

    @GetMapping("", "/")
    fun getAllContacts(@RequestParam("page", defaultValue = "0")  @Min(value = 0) page: Int,
                       @RequestParam("limit", defaultValue = "10") @Min(value = 1) limit: Int,
                       @RequestParam(defaultValue = "") email: String,
                       @RequestParam(defaultValue = "") address: String,
                       @RequestParam(defaultValue = "") telephone: String
    ) : ResponseEntity<List<ContactDTO>> {
        val contacts = contactServices.getAllContacts(page, limit, email, address, telephone)
        return ResponseEntity.ok(contacts)
    }

    @GetMapping("/customers", "/customers/")
    fun getContactsAreCustomer(
        @RequestParam("name", required = false) name: String?,
        @RequestParam("surname", required = false) surname: String?,
        @RequestParam("category", required = false) category: Category?,
        @RequestParam("email", required = false) email: String?,
        @RequestParam("address", required = false) address: String?,
        @RequestParam("ssn", required = false) ssn: String?,
        @RequestParam("telephone", required = false) telephone: String?,
        @RequestParam("jobOffers", required = false) jobOffers: Int?,
        @RequestParam("page", defaultValue = "0")  @Min(value = 0) page: Int,
        @RequestParam("limit", defaultValue = "10") @Min(value = 1) limit: Int
    ) : ResponseEntity<List<CustomerDetailDTO>> {
        //println("Entrando");
        val contacts = contactServices.getContactsAreCustomer(
            name,
            surname,
            category,
            email,
            address,
            ssn,
            telephone,
            jobOffers,
            page,
            limit
        )
        return ResponseEntity.ok(contacts)
    }


    @GetMapping("/professionals", "/professionals/")
    fun getContactsAreProfessional(@RequestParam("page", defaultValue = "0")  @Min(value = 0) page: Int,
                               @RequestParam("limit", defaultValue = "10") @Min(value = 1) limit: Int
    ) : ResponseEntity<List<ProfessionalDetailDTO>> {
        val contacts = contactServices.getContactsAreProfessional(page, limit)
        return ResponseEntity.ok(contacts)
    }

    @GetMapping("/{id}", "/{id}/")
    fun getContactById(@PathVariable @Positive id: Long): ResponseEntity<ContactDTO>{
        val document = contactServices.getContactById(id)
        return ResponseEntity.ok(document)
    }

    @PostMapping("", "/")
    @ResponseStatus(HttpStatus.CREATED)
    fun uploadContact(
        @RequestBody dto: ContactCreateDTO
    ): ContactDTO {
        println("test {$dto}");
        return contactServices.create(dto)
    }

    @PostMapping("/{contactId}/email", "/{contactId}/email/")
    @ResponseStatus(HttpStatus.CREATED)
    fun uploadContactEmail(
        @PathVariable contactId : Long,
        @RequestParam email: String,
    ): EmailDTO {
        return contactServices.uploadEmail(
            contactId,
            email
        )
    }

    @PostMapping("/{contactId}/address", "/{contactId}/address/")
    @ResponseStatus(HttpStatus.CREATED)
    fun uploadContactAddress(
        @PathVariable contactId : Long,
        @RequestParam address: String,
    ): AddressDTO {
        return contactServices.uploadAddress(
            contactId,
            address
        )
    }

    @PostMapping("/{contactId}/telephone", "/{contactId}/telephone/")
    @ResponseStatus(HttpStatus.CREATED)
    fun uploadContactTelephone(
        @PathVariable contactId : Long,
        @RequestParam telephone: String,
    ): TelephoneDTO {
        return contactServices.uploadTelephone(
            contactId,
            telephone
        )
    }

    @PutMapping("/{contactId}/category", "/{contactId}/category/")
    @ResponseStatus(HttpStatus.OK)
    fun updateContactCategory(
        @PathVariable contactId : Long,
        @RequestParam category: Category
    ): ContactDTO    {
        return contactServices.updateCategory(
            contactId,
            category
        )
    }

    @DeleteMapping("/{contactId}/email/{emailId}", "/{contactId}/email/{emailId}/")
    fun deleteContactEmail(@PathVariable contactId: Long, @PathVariable emailId: Long ) {
        contactServices.deleteEmail(contactId, emailId)
    }

    @DeleteMapping("/{contactId}/address/{addressId}", "/{contactId}/address/{addressId}/")
    fun deleteContactAddress(@PathVariable contactId: Long, @PathVariable addressId: Long ) {
        contactServices.deleteAddress(contactId, addressId)
    }

    @DeleteMapping("/{contactId}/telephone/{telephoneId}", "/{contactId}/telephone/{telephoneId}/")
    fun deleteContactTelephone(@PathVariable contactId: Long, @PathVariable telephoneId: Long ) {
        contactServices.deleteTelephone(contactId, telephoneId)
    }

    @PutMapping("/{contactId}/email/{emailId}", "/{contactId}/email/{emailId}/")
    @ResponseStatus(HttpStatus.OK)
    fun updateContactEmail(
        @PathVariable contactId : Long,
        @PathVariable emailId : Long,
        @RequestParam email: String
    ): EmailDTO {
        return contactServices.updateEmail(
            contactId,
            emailId,
            email
        )
    }

    @PutMapping("/{contactId}/address/{addressId}", "/{contactId}/address/{addressId}/")
    @ResponseStatus(HttpStatus.OK)
    fun updateContactAddress(
        @PathVariable contactId : Long,
        @PathVariable addressId : Long,
        @RequestParam address: String
    ): AddressDTO    {
        return contactServices.updateAddress(
            contactId,
            addressId,
            address
        )
    }

    @PutMapping("/{contactId}/telephone/{telephoneId}", "/{contactId}/telephone/{telephoneId}/")
    @ResponseStatus(HttpStatus.OK)
    fun updateContactTelephone(
        @PathVariable contactId : Long,
        @PathVariable telephoneId : Long,
        @RequestParam telephone: String
    ): TelephoneDTO    {
        return contactServices.updateTelephone(
            contactId,
            telephoneId,
            telephone
        )
    }


}