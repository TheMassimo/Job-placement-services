package com.example.crm

import com.example.crm.services.ContactServices
import com.example.crm.dtos.ContactCreateDTO
import jakarta.transaction.Transactional
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql

class TestContacts: IntegrationTest() {
    @Autowired
    private lateinit var contactServices: ContactServices

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldGetAllContacts() {
        val contactList = contactServices.getAllContacts(0, 100, "", "", "")

        assert(contactList.isNotEmpty())
        assert(contactList[0].name == "this is the first contact name")
        assert(contactList[1].name == "this is the second contact name")
        assert(contactList[2].name == "this is the third contact name")
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldGetContactById() {
        val contact = contactServices.getContactById(1L)

        assert(contact.name == "this is the first contact name")
        assert(contact.surname == "this is the first contact surname")
        assert(contact.ssnCode == "this is the first contact ssn code")
        assert(contact.category == "this is the first contact category")
    }

    @Test
    @Transactional
    @Rollback
    fun shouldCreateContacts() {
        contactServices.create(ContactCreateDTO(
            "first contact Name",
            "contact Surname",
            "contact Category",
            "contact ssn code",
            "contact Email",
            "contact Address",
            "contact Telephone"
        ))
        contactServices.create(ContactCreateDTO(
            "second contact Name",
            "contact Surname",
            "contact Category",
            "contact ssn code",
            "contact Email",
            "contact Address",
            "contact Telephone"
        ))
        val contactList = contactServices.getAllContacts(0, 100, "", "", "")

        assert(contactList.size == 2)
        assert(contactList[0].name == "first contact Name")
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldAddEmailToContact() {
        val contactList = contactServices.getAllContacts(0, 1, "", "", "")
        val contactId = contactList[0].contactId

        contactServices.uploadEmail(contactId, "first email")
        contactServices.uploadEmail(contactId, "second email")
        contactServices.uploadEmail(contactId, "third email")
        contactServices.uploadEmail(contactId, "fourth email")

        val contact = contactServices.getContactById(contactId)
        assert(contact.email.size == 4)
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldAddAddressToContact() {
        val contactList = contactServices.getAllContacts(0, 1, "", "", "")
        val contactId = contactList[0].contactId

        contactServices.uploadAddress(contactId, "first address")
        contactServices.uploadAddress(contactId, "second address")
        contactServices.uploadAddress(contactId, "third address")
        contactServices.uploadAddress(contactId, "fourth address")

        val contact = contactServices.getContactById(1L)

        assert(contact.address.size == 4)
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldAddTelephoneToContact() {
        val contactList = contactServices.getAllContacts(0, 1, "", "", "")
        val contactId = contactList[0].contactId

        contactServices.uploadTelephone(contactId, "first phone")
        contactServices.uploadTelephone(contactId, "second phone")
        contactServices.uploadTelephone(contactId, "third phone")
        contactServices.uploadTelephone(contactId, "fourth phone")

        val contact = contactServices.getContactById(contactId)

        assert(contact.telephone.size == 4)
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldUpdateContactCategory() {
        val contact = contactServices.updateCategory(1L,"new contact category")
        assert(contact.category == "new contact category")
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldDeleteEmailFromContact() {
        val contactList = contactServices.getAllContacts(0, 1, "", "", "")
        val contactId = contactList[0].contactId

        val firstEmail = contactServices.uploadEmail(contactId, "first email")
        contactServices.uploadEmail(contactId, "second email")
        contactServices.uploadEmail(contactId, "third email")
        contactServices.uploadEmail(contactId, "fourth email")

        var contact = contactServices.getContactById(contactId)
        assert(contact.email.size == 4)

        contactServices.deleteEmail(contactId, firstEmail.emailId)

        contact = contactServices.getContactById(contactId)
        assert(contact.email.size == 3)
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldDeleteAddressFromContact() {
        val contactList = contactServices.getAllContacts(0, 1, "", "", "")
        val contactId = contactList[0].contactId

        val firstAddress = contactServices.uploadAddress(contactId, "first address")
        contactServices.uploadAddress(contactId, "second address")
        contactServices.uploadAddress(contactId, "third address")
        contactServices.uploadAddress(contactId, "fourth address")

        var contact = contactServices.getContactById(contactId)
        assert(contact.address.size == 4)

        contactServices.deleteAddress(contactId, firstAddress.addressId)

        contact = contactServices.getContactById(contactId)
        assert(contact.address.size == 3)
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldDeleteTelephoneFromContact() {
        val contactList = contactServices.getAllContacts(0, 1, "", "", "")
        val contactId = contactList[0].contactId

        val firstPhone = contactServices.uploadTelephone(contactId, "first phone")
        contactServices.uploadTelephone(contactId, "second phone")
        contactServices.uploadTelephone(contactId, "third phone")
        contactServices.uploadTelephone(contactId, "fourth phone")

        var contact = contactServices.getContactById(contactId)
        assert(contact.telephone.size == 4)

        contactServices.deleteTelephone(contactId, firstPhone.telephoneId)

        contact = contactServices.getContactById(contactId)
        assert(contact.telephone.size == 3)
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldUpdateEmailOfContact() {
        val contactList = contactServices.getAllContacts(0, 1, "", "", "")
        val contactId = contactList[0].contactId

        val originalEmail = contactServices.uploadEmail(contactId, "original email")
        var contact = contactServices.getContactById(contactId)
        assert(contact.email[0].email == originalEmail.email)

        val newEmail = contactServices.updateEmail(contactId, originalEmail.emailId, "new email")
        contact = contactServices.getContactById(contactId)
        assert(contact.email[0].email == newEmail.email)
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldUpdateAddressFromContact() {
        val contactList = contactServices.getAllContacts(0, 1, "", "", "")
        val contactId = contactList[0].contactId

        val originalAddress = contactServices.uploadAddress(contactId, "original address")
        var contact = contactServices.getContactById(contactId)
        assert(contact.address[0].address == originalAddress.address)

        val newAddress = contactServices.updateAddress(contactId, originalAddress.addressId, "new address")
        contact = contactServices.getContactById(contactId)
        assert(contact.address[0].address == newAddress.address)
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldUpdateTelephoneFromContact() {
        val contactList = contactServices.getAllContacts(0, 1, "", "", "")
        val contactId = contactList[0].contactId

        val originalPhone = contactServices.uploadTelephone(contactId, "original phone")
        var contact = contactServices.getContactById(contactId)
        assert(contact.telephone[0].telephone == originalPhone.telephone)

        val newPhone = contactServices.updateTelephone(contactId, originalPhone.telephoneId, "new phone")
        contact = contactServices.getContactById(contactId)
        assert(contact.telephone[0].telephone == newPhone.telephone)
    }
}