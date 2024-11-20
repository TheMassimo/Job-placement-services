package com.example.crm.services

import com.example.crm.dtos.*
import com.example.crm.entities.*

import com.example.crm.repositories.ContactRepository
import org.springframework.stereotype.Service
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.data.domain.PageRequest
import com.example.crm.exeptions.BadParameterException
import com.example.crm.exeptions.ContactNotFoundException
import com.example.crm.repositories.AddressRepository
import com.example.crm.repositories.EmailRepository
import com.example.crm.repositories.TelephoneRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.transaction.annotation.Transactional


@Service
class ContactServicesImpl(private val contactRepository: ContactRepository,
                          private val emailRepository: EmailRepository,
                          private val addressRepository: AddressRepository,
                          private val telephoneRepository: TelephoneRepository ): ContactServices  {

    private val logger: Logger = LoggerFactory.getLogger(ContactServices::class.java)

    override fun getAllContacts(page: Int, limit: Int, email:String, address: String, telephone: String): List<ContactDTO> {
        val pageable = PageRequest.of(page, limit)
        val contacts = contactRepository.findAll(pageable)

        //apply filter if present
        var ritorno: List<Contact> = contacts.content
        if(email != ""){
            ritorno = ritorno.filter { it.email.any { x -> x.email.contains(email) } }
            logger.info("filtered by email")
        }
        if(address != ""){
            ritorno = ritorno.filter { it.address.any { x -> x.address.contains(address) } }
            logger.info("filtered by address")
        }
        if(email != ""){
            ritorno = ritorno.filter { it.telephone.any { x -> x.telephone.contains(telephone) } }
            logger.info("filtered by telephone")
        }

        logger.info("Contacts fetched successfully")
        return ritorno.map { it.toDto() }
    }

    override fun getContactById(id: Long): ContactDTO {
        val contact = contactRepository.findByIdOrNull(id)
            ?: throw ContactNotFoundException("Contact not found")
        logger.info("Contact fetched successfully")
        return contact.toDto()
    }

    override fun create(
        dto: ContactCreateDTO
    ) : ContactDTO {

        //Check if an email already exists, otherwise create a new one.
        var eEmail = emailRepository.findIdByEmail(dto.email?: "")
        if(eEmail == null){
            eEmail = Email()
            eEmail.email = dto.email?: ""
            emailRepository.save(eEmail)
            logger.info("New email created")
        }else{
            logger.info("Email already exist")
        }

        //Check if an address already exists, otherwise create a new one.
        var eAddress = addressRepository.findIdByAddress(dto.address?: "")
        if(eAddress == null){
            eAddress = Address()
            eAddress.address = dto.address?: ""
            addressRepository.save(eAddress)
            logger.info("New address created")
        }else{
            logger.info("Address already exist")
        }

        //Check if a Telephone already exists, otherwise create a new one.
        var eTelephone = telephoneRepository.findIdByTelephone(dto.telephone?: "")
        if(eTelephone == null){
            eTelephone = Telephone()
            eTelephone.telephone = dto.telephone?: ""
            telephoneRepository.save(eTelephone)
            logger.info("New telephone created")
        }else{
            logger.info("Telephone already exist")
        }

        //Finally crate the new contact and add email,address and telephone
        val eContact = Contact()
        eContact.name = dto.name
        eContact.surname = dto.surname
        eContact.ssnCode = dto.ssnCode ?: ""
        eContact.category = dto.category
        eContact.addEmail(eEmail)
        eContact.addAddress(eAddress)
        eContact.addTelephone(eTelephone)

        val contactDTO = contactRepository.save(eContact).toDto()

        logger.info("Contact created with success")
        return contactDTO
    }

    override fun uploadEmail(
        contactId: Long,
        email: String
    ) : EmailDTO {

        //check if a contact exist
        val contact = contactRepository.findByIdOrNull(contactId)
            ?: throw BadParameterException("Contact not found")

        //before add the new email, check if it already exists
        var eEmail = emailRepository.findIdByEmail(email)
        if(eEmail == null){
            eEmail = Email()
            eEmail.email = email
            emailRepository.save(eEmail)
            logger.info("New email created")
        }else{
            logger.info("Email already exist")
        }

        //add the new email
        contact.addEmail(eEmail)
        contactRepository.save(contact)

        logger.info("Email added")
        return eEmail.toDto()
    }

    override fun uploadAddress(
        contactId: Long,
        address: String
    ) : AddressDTO {

        //check if a contact exist
        val contact = contactRepository.findByIdOrNull(contactId)
            ?: throw BadParameterException("Contact not found")

        //before add the new address, check if it already exists
        var eAddress = addressRepository.findIdByAddress(address)
        if(eAddress == null){
            eAddress = Address()
            eAddress.address = address
            addressRepository.save(eAddress)
            logger.info("New address created")
        }else{
            logger.info("Address already exist")
        }

        //add the new address
        contact.addAddress(eAddress)
        contactRepository.save(contact)

        logger.info("Address added")
        return eAddress.toDto()
    }

    override fun uploadTelephone(
        contactId: Long,
        telephone: String
    ) : TelephoneDTO {

        //check if a contact exist
        val contact = contactRepository.findByIdOrNull(contactId)
            ?: throw BadParameterException("Contact not found")

        //before add the new telephone, chek if it already exist
        var eTelephone = telephoneRepository.findIdByTelephone(telephone)
        if(eTelephone == null){
            eTelephone = Telephone()
            eTelephone.telephone = telephone
            telephoneRepository.save(eTelephone)
            logger.info("New telephone created")
        }else{
            logger.info("Telephone already exist")
        }

        //add the new telephone
        contact.addTelephone(eTelephone)
        contactRepository.save(contact)

        logger.info("Telephone added")
        return eTelephone.toDto()
    }

    override fun updateCategory(id: Long, category:String): ContactDTO{
        val existingContact = contactRepository.findById(id)
            .orElseThrow{
                logger.error("Contact not found")
                throw ContactNotFoundException("Contact not found")
            }

        existingContact.category = category
        contactRepository.save(existingContact)

        logger.info("Contact category modified successfully")

        return contactRepository.save(existingContact).toDto()
    }

    override fun deleteEmail (contactId: Long, emailId: Long ){
        //check if contact exist
        val eContact = contactRepository.findByIdOrNull(contactId)
            ?: throw BadParameterException("Contact not found")

        //check if email exist
        val eEmail = emailRepository.findByIdOrNull(emailId)
        ?: throw BadParameterException("Email not found")

        //check if the contact has that email
        if(!eContact.email.contains(eEmail)){
            throw BadParameterException("The contact $contactId has not the mail $emailId")
        }

        //delete the email from the contact
        eContact.removeEmail(eEmail)
        contactRepository.save(eContact)

        logger.info("Email successfully deleted from the contact")
    }

    override fun deleteAddress (contactId: Long, addressId: Long ){
        //check if contact exist
        val eContact = contactRepository.findByIdOrNull(contactId)
            ?: throw BadParameterException("Contact not found")

        //check if address exist
        val eAddress = addressRepository.findByIdOrNull(addressId)
            ?: throw BadParameterException("Address not found")

        //check if the contact has that email
        if(!eContact.address.contains(eAddress)){
            throw BadParameterException("The contact $contactId has not the address $addressId")
        }

        //delete the address from the contact
        eContact.removeAddress(eAddress)
        contactRepository.save(eContact)

        logger.info("Address successfully deleted from the contact")
    }

    override fun deleteTelephone (contactId: Long, telephoneId: Long ){
        //check if contact exist
        val eContact = contactRepository.findByIdOrNull(contactId)
            ?: throw BadParameterException("Contact not found")

        //check if telephone exist
        val eTelephone = telephoneRepository.findByIdOrNull(telephoneId)
            ?: throw BadParameterException("Telephone not found")

        //check if the contact has that email
        if(!eContact.telephone.contains(eTelephone)){
            throw BadParameterException("The contact $contactId has not the telephone $telephoneId")
        }

        //delete the telephone from the contact
        eContact.removeTelephone(eTelephone)
        contactRepository.save(eContact)

        logger.info("Telephone successfully deleted from the contact")
    }

    @Transactional
    override fun updateEmail(contactId: Long, emailId: Long, email: String): EmailDTO{
        //delete the current email for that contact
        deleteEmail(contactId, emailId)
        //insert the new email
        return uploadEmail(contactId, email)
    }

    @Transactional
    override fun updateAddress(contactId: Long, addressId: Long, address: String): AddressDTO{
        //delete the current address for that contact
        deleteAddress(contactId, addressId)
        //insert the new address
        return uploadAddress(contactId, address)
    }

    @Transactional
    override fun updateTelephone(contactId: Long, telephoneId: Long, telephone: String): TelephoneDTO{
        //delete the current telephone for that contact
        deleteTelephone(contactId, telephoneId)
        //insert the new telephone
        return uploadTelephone(contactId, telephone)
    }
}