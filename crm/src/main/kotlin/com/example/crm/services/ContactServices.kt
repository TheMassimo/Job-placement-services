package com.example.crm.services

import com.example.crm.dtos.*


interface ContactServices {

    fun getAllContacts(page: Int, limit: Int, email:String, address: String, telephone: String): List<ContactDTO>

    fun getContactById(id: Long): ContactDTO

    fun create(dto: ContactCreateDTO): ContactDTO

    fun uploadEmail(contactId: Long, email: String ): EmailDTO

    fun uploadAddress(contactId: Long, address: String ): AddressDTO

    fun uploadTelephone(contactId: Long, telephone: String ): TelephoneDTO

    fun updateCategory(id: Long, category:String): ContactDTO

    fun deleteEmail(contactId: Long, emailId: Long)

    fun deleteAddress(contactId: Long, addressId: Long)

    fun deleteTelephone(contactId: Long, telephoneId: Long)

    fun updateEmail(contactId: Long, emailId: Long, email: String): EmailDTO

    fun updateAddress(contactId: Long, addressId: Long, address: String): AddressDTO

    fun updateTelephone(contactId: Long, telephoneId: Long, telephone: String): TelephoneDTO
}

