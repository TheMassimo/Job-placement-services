package com.example.crm.services

import com.example.crm.dtos.*
import com.example.crm.entities.Category
import com.example.crm.entities.Contact
import com.example.crm.entities.ProfessionalEmployment


interface ContactServices {

    fun getAllContacts(
        name:String?,
        surname:String?,
        ssn:String?,
        email:String?,
        address:String?,
        telephone:String?,
        category:Category?,
        jobOffers: Int?,
        skills:String?,
        status: ProfessionalEmployment?,
        geographicalInfo:String?,
        pageNumber: Int,
        pageSize: Int
    ): List<ContactDetailsDTO>

    fun getContactById(id: Long): ContactDetailsDTO

    fun create(dto: ContactCreateDTO): ContactDTO

    fun uploadEmail(contactId: Long, email: String ): EmailDTO

    fun uploadAddress(contactId: Long, address: String ): AddressDTO

    fun uploadTelephone(contactId: Long, telephone: String ): TelephoneDTO

    fun updateCategory(id: Long, category:Category): ContactDTO

    fun downgradeCategory(id: Long, category:Category): ContactDTO

    fun deleteEmail(contactId: Long, emailId: Long)

    fun deleteAddress(contactId: Long, addressId: Long)

    fun deleteTelephone(contactId: Long, telephoneId: Long)

    fun updateContact(contactId:Long, dto: ContactCreateDTO): ContactDTO

    fun updateEmail(contactId: Long, emailId: Long, email: String): EmailDTO

    fun updateAddress(contactId: Long, addressId: Long, address: String): AddressDTO

    fun updateTelephone(contactId: Long, telephoneId: Long, telephone: String): TelephoneDTO
}

