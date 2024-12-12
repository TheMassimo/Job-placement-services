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
import org.hibernate.type.descriptor.jdbc.SmallIntJdbcType
import org.springframework.data.repository.findByIdOrNull
import org.springframework.transaction.annotation.Transactional
import jakarta.persistence.EntityManager
import jakarta.persistence.criteria.*



@Service
class ContactServicesImpl(private val entityManager: EntityManager,
                          private val contactRepository: ContactRepository,
                          private val emailRepository: EmailRepository,
                          private val addressRepository: AddressRepository,
                          private val telephoneRepository: TelephoneRepository ): ContactServices  {

    private val logger: Logger = LoggerFactory.getLogger(ContactServices::class.java)

    override fun getAllContacts(
        name:String?,
        surname:String?,
        ssn:String?,
        email:String?,
        address:String?,
        telephone:String?,
        category:Category?,
        jobOffers: Int?,
        skills:String?,
        status:ProfessionalEmployment?,
        geographicalInfo:String?,
        pageNumber: Int,
        pageSize: Int
    ): List<ContactDetailsDTO> {
        val cb: CriteriaBuilder = entityManager.criteriaBuilder
        val cqContact: CriteriaQuery<Contact> = cb.createQuery(Contact::class.java)
        val rootContact: Root<Contact> = cqContact.from(Contact::class.java)


        //prepare predicates list
        val predicates = mutableListOf<Predicate>()

        if (!name.isNullOrBlank()) {
            predicates.add(cb.like(cb.lower(rootContact.get<String>("name")), "${name.lowercase()}%"))
        }

        if (!surname.isNullOrBlank()) {
            predicates.add(cb.like(cb.lower(rootContact.get<String>("surname")), "${surname.lowercase()}%"))
        }

        if (!ssn.isNullOrBlank()) {
            predicates.add(cb.like(cb.lower(rootContact.get<String>("ssn")), "${ssn.lowercase()}%"))
        }

        if (!email.isNullOrBlank()) {
            val joinWithEmail: Join<Contact, Email> = rootContact.join("email", JoinType.INNER)
            predicates.add(cb.like(cb.lower(joinWithEmail.get<String>("email")), "${email.lowercase()}%"))
            //predicates.add(cb.equal(joinWithEmail.get<String>("email"), email))
        }

        if (!address.isNullOrBlank()) {
            val joinWithAddress: Join<Contact, Address> = rootContact.join("address", JoinType.INNER)
            predicates.add(cb.like(cb.lower(joinWithAddress.get<String>("address")), "${address.lowercase()}%"))
            //predicates.add(cb.equal(joinWithAddress.get<String>("address"), address))
        }

        if (!telephone.isNullOrBlank()) {
            val joinWithTelephone: Join<Contact, Telephone> = rootContact.join("telephone", JoinType.INNER)
            predicates.add(cb.like(cb.lower(joinWithTelephone.get<String>("telephone")), "${telephone.lowercase()}%"))
            //predicates.add(cb.equal(joinWithTelephone.get<String>("telephoneNumber"), telephone))
        }

        if (category != null) {
            val categoryPredicates = when (category) {
                Category.Customer -> listOf(
                    cb.equal(rootContact.get<Category>("category"), Category.Customer),
                    cb.equal(rootContact.get<Category>("category"), Category.CustomerProfessional)
                )
                Category.Professional -> listOf(
                    cb.equal(rootContact.get<Category>("category"), Category.Professional),
                    cb.equal(rootContact.get<Category>("category"), Category.CustomerProfessional)
                )
                Category.Unknown -> listOf(cb.equal(rootContact.get<Category>("category"), Category.Unknown))
                Category.CustomerProfessional -> listOf(
                    cb.equal(
                        rootContact.get<Category>("category"),
                        Category.CustomerProfessional
                    )
                )
            }

            // Combine all filters in OR
            predicates.add(cb.or(*categoryPredicates.toTypedArray()))
        }

        if (jobOffers != null) {
            // Join da Contact a Customer
            val joinWithCustomer: Join<Contact, Customer> = rootContact.join("customer", JoinType.LEFT)

            // Join da Customer a JobOffers
            val joinWithJobOffers: Join<Customer, JobOffer> = joinWithCustomer.join("jobOffers", JoinType.LEFT)

            // Conta i JobOffers
            val jobOfferCount = cb.count(joinWithJobOffers)

            // Subquery per filtrare Contact con più di un certo numero di JobOffers
            val subquery = cqContact.subquery(Long::class.java)
            val subqueryRoot = subquery.from(Contact::class.java)

            // Join nel subquery
            val subqueryJoinWithCustomer = subqueryRoot.join<Contact, Customer>("customer", JoinType.LEFT)
            val subqueryJoinWithJobOffers = subqueryJoinWithCustomer.join<Customer, JobOffer>("jobOffers", JoinType.LEFT)

            subquery.select(cb.count(subqueryJoinWithJobOffers))
                .where(cb.equal(subqueryRoot.get<Long>("contactId"), rootContact.get<Long>("contactId")))

            // Usa `jobOffers` come soglia per il confronto
            predicates.add(cb.greaterThanOrEqualTo(subquery, jobOffers.toLong()))
        }

        if (!skills.isNullOrBlank()) {
            // Effettua la join tra Contact e Professional
            val joinWithProfessional: Join<Contact, Professional> = rootContact.join("professional", JoinType.LEFT)

            // Effettua la join tra Professional e Skill (skills è una relazione Many-to-Many)
            val joinWithSkills: Join<Professional, Skill> = joinWithProfessional.join("skills", JoinType.LEFT)

            // Aggiungi il predicato per cercare la skill che esattamente corrisponde al valore
            predicates.add(cb.equal(cb.lower(joinWithSkills.get<String>("skill")), skills.lowercase()))
        }

        if (status != null) {
            // Effettua la join diretta tra Contact e Professional
            val joinWithProfessional: Join<Contact, Professional> = rootContact.join("professional", JoinType.LEFT)

            // Aggiungi il predicato per employment
            predicates.add(cb.equal(joinWithProfessional.get<ProfessionalEmployment>("employment"), status))
        }

        if (!geographicalInfo.isNullOrBlank()) {
            // Effettua la join diretta tra Contact e Professional
            val joinWithProfessional: Join<Contact, Professional> = rootContact.join("professional", JoinType.LEFT)

            // Aggiungi il predicato per geographicalInfo che inizia con il valore specificato
            predicates.add(cb.like(cb.lower(joinWithProfessional.get<String>("geographicalInfo")), "${geographicalInfo.lowercase()}%"))
        }

        // Combine all filters
        if (predicates.isNotEmpty()) {
            cqContact.where(*predicates.toTypedArray())
        }

        // Set order
        cqContact.orderBy(cb.asc(rootContact.get<Long>("contactId")))

        // Create the query
        val query = entityManager.createQuery(cqContact)
        query.firstResult = pageNumber * pageSize
        query.maxResults = pageSize  // Limitiamo il numero di risultati

        // execute the query anf get results
        val resultList = query.resultList

        return resultList.map { contact ->
            //logger.info("RESULT {$contact}");
            contact.toDetailsDto()
        }
    }

    override fun getContactById(id: Long): ContactDetailsDTO {
        val contact = contactRepository.findByIdOrNull(id)
            ?: throw ContactNotFoundException("Contact not found")
        logger.info("Contact fetched successfully")
        return contact.toDetailsDto()
    }

    override fun create(
        dto: ContactCreateDTO
    ) : ContactDTO {

        //Controllo che non esista già un contatto con q uell ssn
        if (dto.ssn != null && contactRepository.existsBySsn(dto.ssn)) {
            logger.error("Contact with SSN '${dto.ssn}' already exists")
            throw BadParameterException("Contact with SSN '${dto.ssn}' already exists")
        }

        //Crate the new contact and add email,address and telephone
        val eContact = Contact()
        eContact.name = dto.name
        eContact.surname = dto.surname
        eContact.ssn = dto.ssn ?: ""
        eContact.category = Category.Unknown

        contactRepository.save(eContact)

        //Check if every email exist or not
        dto.email?.forEach { emailString ->
            // Check if the email already exists
            var eEmail = emailRepository.findIdByEmail(emailString)
            if (eEmail == null) {
                eEmail = Email()
                eEmail.email = emailString
                emailRepository.save(eEmail)
                logger.info("New email created: $emailString")
            } else {
                logger.info("Email already exists: $emailString")
            }
            eContact.addEmail(eEmail)
        }

        //Check if every address exist or not
        dto.address?.forEach { addressString ->
            // Check if the email already exists
            var eAddress = addressRepository.findIdByAddress(addressString)
            if (eAddress == null) {
                eAddress = Address()
                eAddress.address = addressString
                addressRepository.save(eAddress)
                logger.info("New address created: $addressString")
            } else {
                logger.info("Address already exist: $addressString")
            }
            eContact.addAddress(eAddress)
        }

        //Check if every telephone exist or not
        dto.telephone?.forEach { telephoneString ->
            // Check if the email already exists
            var eTelephone = telephoneRepository.findIdByTelephone(telephoneString)
            if (eTelephone == null) {
                eTelephone = Telephone()
                eTelephone.telephone = telephoneString
                telephoneRepository.save(eTelephone)
                logger.info("New telephone created: $telephoneString")
            } else {
                logger.info("Telephone already exist: $telephoneString")
            }
            eContact.addTelephone(eTelephone)
        }

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

        //before add the new telephone, chek if it already exists
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

    override fun updateCategory(id: Long, category:Category): ContactDTO{
        val existingContact = contactRepository.findById(id)
            .orElseThrow{
                logger.error("Contact not found")
                throw ContactNotFoundException("Contact not found")
            }

        if(category == Category.Customer){
            if(existingContact.category == Category.Professional){
                existingContact.category = Category.CustomerProfessional;
            }else{
                existingContact.category = Category.Customer;
            }
        }

        if(category == Category.Professional){
            if(existingContact.category == Category.Customer){
                existingContact.category = Category.CustomerProfessional;
            }else{
                existingContact.category = Category.Professional;
            }
        }

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

    override fun updateContact(contactId:Long, dto: ContactCreateDTO): ContactDTO{
        logger.info("Updating contact with ID $contactId")

        val contact = contactRepository.findById(contactId)
            .orElseThrow { ContactNotFoundException("Contact with id $contactId not found") }

        contact.name = dto.name
        contact.surname = dto.surname
        contact.ssn = dto.ssn ?: ""

        val savedContact = contactRepository.save(contact)

        logger.info("Name updated successfully")

        return savedContact.toDto()
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