package com.example.crm.controllers

import com.example.crm.dtos.*
import com.example.crm.entities.Category
import com.example.crm.entities.ProfessionalEmployment
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
    fun getAllContacts(
        @RequestParam("name", required = false) name: String?,
        @RequestParam("surname", required = false) surname: String?,
        @RequestParam("ssn", required = false) ssn: String?,
        @RequestParam("email", required = false) email: String?,
        @RequestParam("address", required = false) address: String?,
        @RequestParam("telephone", required = false) telephone: String?,
        @RequestParam("category", required = false) category: Category?,
        @RequestParam("jobOffers", required = false) jobOffers: Int?,
        @RequestParam("skills", required = false) skills: String?,
        @RequestParam("status", required = false) status: ProfessionalEmployment?,
        @RequestParam("geographicalInfo", required = false) geographicalInfo: String?,
        @RequestParam("pageNumber", required = false) @Min(
            value = 0,
            message = "Page number not valid, value must be great or equal to 0"
        ) pageNumber: Int = 0,
        @RequestParam("pageSize", required = false) @Min(
            value = 1,
            message = "Page size not valid, value must be great or equal to 1"
        ) pageSize: Int = 20,
    ) : ResponseEntity<List<ContactDetailsDTO>> {
        val contacts = contactServices.getAllContacts(
            name,
            surname,
            ssn,
            email,
            address,
            telephone,
            category,
            jobOffers,
            skills,
            status,
            geographicalInfo,
            pageNumber,
            pageSize
        );

        return ResponseEntity.ok(contacts)
    }

    @GetMapping("/{id}", "/{id}/")
    fun getContactById(@PathVariable @Positive id: Long): ResponseEntity<ContactDetailsDTO>{
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

    @DeleteMapping("/{id}")
    //@PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_manager', 'ROLE_recruiter')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteContact(
        @PathVariable("id", required = true) contactId: Long
    ) {
        contactServices.deleteContact(contactId)
    }

    @PostMapping("/{contactId}/email", "/{contactId}/email/")
    @ResponseStatus(HttpStatus.CREATED)
    fun uploadContactEmail(
        @PathVariable contactId : Long,
        @RequestBody email: String,
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
        @RequestBody address: String,
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
        @RequestBody telephone: String,
    ): TelephoneDTO {
        return contactServices.uploadTelephone(
            contactId,
            telephone
        )
    }

    @PutMapping("/{contactId}", "/{contactId}/")
    @ResponseStatus(HttpStatus.OK)
    fun updateContact(
        @PathVariable contactId : Long,
        @RequestBody dto: ContactCreateDTO
    ):ContactDTO{
        return contactServices.updateContact(contactId, dto)
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
        @RequestBody email: String
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
        @RequestBody address: String
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
        @RequestBody telephone: String
    ): TelephoneDTO    {
        return contactServices.updateTelephone(
            contactId,
            telephoneId,
            telephone
        )
    }


}