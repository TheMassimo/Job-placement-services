package com.example.crm.services

import com.example.crm.dtos.*
import com.example.crm.entities.*
import com.example.crm.exeptions.ContactNotFoundException
import com.example.crm.exeptions.CustomerNotFoundException
import com.example.crm.exeptions.ProfessionalNotFoundException
import com.example.crm.exeptions.*
import com.example.crm.repositories.*
import jakarta.persistence.EntityManager
import jakarta.persistence.criteria.CriteriaBuilder
import jakarta.persistence.criteria.CriteriaQuery
import jakarta.persistence.criteria.Root
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.data.domain.PageRequest
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import jakarta.persistence.criteria.*


@Service
class JobOfferServicesImpl(private val entityManager: EntityManager,
                           private val jobOfferRepository: JobOfferRepository,
                           private val customerRepository: CustomerRepository,
                           private val contactRepository: ContactRepository,
                           private val professionalRepository: ProfessionalRepository,
                           private val skillRepository: SkillRepository
): JobOfferServices   {
    private val logger: Logger = LoggerFactory.getLogger(ContactServices::class.java)

    override fun getOpenJobOffers(customerId: Long, page: Int, limit: Int): List<JobOfferDTO> {
        //find the customer
        val pageable = PageRequest.of(page, limit)

        val myCustomer = customerRepository.findByIdOrNull(customerId)
            ?: throw CustomerNotFoundException("Customer not found")

        val validStatus = listOf(JobStatus.CREATED, JobStatus.SELECTION_PHASE, JobStatus.CANDIDATE_PROPOSAL)
        val result = jobOfferRepository.findByStatusInAndCurrentCustomer(validStatus, myCustomer, pageable)

        return result.content.map { it.toDto() }
    }

    override fun getAcceptedJobOffers(professionalId: Long, page: Int, limit: Int): List<JobOfferDTO> {

        val pageable = PageRequest.of(page, limit)

        //find the professional
        val myProfessional = professionalRepository.findByIdOrNull(professionalId)
            ?: throw ProfessionalNotFoundException("Professional not found")

        val validStatus = listOf(JobStatus.CONSOLIDATED, JobStatus.DONE)
        val result = jobOfferRepository.findByStatusInAndProfessional(validStatus, myProfessional, pageable)

        return result.content.map { it.toDto() }
    }

    override fun getAbortedJobOffers(page: Int, limit: Int, customer: String, professional: String): List<JobOfferDTO> {
        val pageable = PageRequest.of(page, limit)

        val validStatus = listOf(JobStatus.ABORTED)
        val jobOffers = jobOfferRepository.findByStatusIn(validStatus, pageable)

        //apply filter if present
        var ritorno: List<JobOffer> = jobOffers.content

        if(customer != ""){
            ritorno = ritorno.filter {
                it.currentCustomer?.contact?.name?.contains(customer) ?: false
            }
            logger.info("filtered by customer")
        }

        if(professional != ""){
            ritorno = ritorno.filter {
                it.professional?.contact?.name?.contains(professional) ?: false
            }
            logger.info("filtered by professional")
        }

        logger.info("Aborted job offers fetched successfully")
        return ritorno.map { it.toDto() }

    }

    override fun getJobOffers(
        customerId: Long?,
        professionalId: Long?,
        status: JobStatus?,
        description: String?,
        duration: Int?,
        offerValue: Int?,
        requiredSkills: String?,
        pageNumber: Int,
        pageSize: Int
    ): List<JobOfferDTO>{

        val cb: CriteriaBuilder = entityManager.criteriaBuilder
        val cqJobOffer: CriteriaQuery<JobOffer> = cb.createQuery(JobOffer::class.java)
        val rootJobOffer: Root<JobOffer> = cqJobOffer.from(JobOffer::class.java)

        //prepare predicates list
        val predicates = mutableListOf<Predicate>()

        if (!description.isNullOrBlank()) {
            predicates.add(cb.like(cb.lower(rootJobOffer.get<String>("description")), "${description.lowercase()}%"))
        }

        if (duration != null) {
            predicates.add(cb.greaterThanOrEqualTo(rootJobOffer.get<Int>("duration"), duration));
        }

        if (status != null) {
            // Aggiungi il predicato per employment
            predicates.add(cb.equal(rootJobOffer.get<JobStatus>("status"), status))
        }

        if (offerValue != null) {
            predicates.add(cb.greaterThanOrEqualTo(rootJobOffer.get<Int>("offerValue"), offerValue));
        }

        if (!requiredSkills.isNullOrBlank()) {
            val skillJoin: Join<JobOffer, Skill> = rootJobOffer.join("requiredSkills") // Nome del campo associato
            predicates.add(cb.equal(skillJoin.get<String>("skill"), requiredSkills))
        }

        // Combine all filters
        if (predicates.isNotEmpty()) {
            cqJobOffer.where(*predicates.toTypedArray())
        }

        // Set order
        cqJobOffer.orderBy(cb.asc(rootJobOffer.get<Long>("jobOfferId")))

        // Create the query
        val query = entityManager.createQuery(cqJobOffer)
        query.firstResult = pageNumber * pageSize
        query.maxResults = pageSize  // Limitiamo il numero di risultati

        // execute the query anf get results
        val resultList = query.resultList

        return resultList.map { jobOffer ->
            //logger.info("RESULT {$jobOffer}");
            jobOffer.toDto()
        }
    }

    @Transactional
    override fun create(
        dto: JobOfferCreateDTO, contactId: Long
    ): JobOfferDTO {
        val j = JobOffer()

        dto.requiredSkills?.forEach { skillId ->
            val eSkill = skillRepository.findByIdOrNull(skillId)
            if (eSkill == null) {
                throw ElementNotFoundException("Skill with ID $skillId not found")
            } else {
                logger.info("skill added")
            }
            j.addSkill(eSkill)
        }

        j.description = dto.description
        j.status = JobStatus.CREATED
        j.notes = dto.notes ?: ""
        j.duration = dto.duration
        j.offerValue = dto.offerValue

        //check if contact exist
        val myContact = contactRepository.findByIdOrNull(contactId)
            ?: throw ContactNotFoundException("Contact not found")

        //check if the customer with that contactId exist
        if (myContact.customer == null) {
            val myCustomer = Customer()
            myCustomer.contact = myContact
            myCustomer.notes = ""
            //save this new customer
            customerRepository.save(myCustomer)
            logger.info("New customer from contact successfully created")
            //connect customer and jobOffer
            j.addCustomer(myCustomer)
        } else {
            //connect customer and jobOffer
            myContact.customer?.let { j.addCustomer(it) }
        }

        val jDTO = jobOfferRepository.save(j).toDto()
        logger.info("Job offer successfully created and associated")

        return jDTO
    }

    override fun getContactIdByJobOfferId(jobOfferId: Long): Long? {
        val jobOffer = jobOfferRepository.findByJobOfferId(jobOfferId)
        return jobOffer?.currentCustomer?.contact?.contactId
    }

    override fun updateJobOfferStatus(jobOfferId: Long, status: String): JobOfferDTO {
        val jobOffer = jobOfferRepository.findByIdOrNull(jobOfferId)
            ?: throw ElementNotFoundException("JobOffer not found")

        //check if the given state is valid
        val possibleStates = jobOffer.status.getJobStatusFor()
        val newState: JobStatus
        try {
            newState = JobStatus.valueOf(status.uppercase())
        } catch (e: Exception) {
            throw BadParameterException("$status is not a valid state")
        }
        if (!possibleStates.contains(newState)) {
            throw BadParameterException("Cannot transition to this state from " + jobOffer.status.name)
        }

       /*
        if(jobOffer.status == JobStatus.SELECTION_PHASE && newState==JobStatus.CANDIDATE_PROPOSAL){
            if(professionalId == null){
                throw BadParameterException("Professional id not given")
            }else{
                val professional = professionalRepository.findByIdOrNull(professionalId)
                    ?: throw ElementNotFoundException("Professional of professionalId: $professionalId not found")

                if(professional.employment == ProfessionalEmployment.UNEMPLOYED){
                    //set the new status
                    professional.employment = ProfessionalEmployment.BUSY
                    //bind the ids
                    jobOffer.addCandidateProfiles(professional)
                    //save the new proposal value
                    professionalRepository.save(professional)
                }else{
                    throw BadParameterException("This professional is already bounds to another jobOffer")
                }
            }
        }else if(jobOffer.status == JobStatus.CANDIDATE_PROPOSAL && newState==JobStatus.CONSOLIDATED){
            if(professionalId == null){
                throw BadParameterException("Professional id not given")
            }else{
                val professional = professionalRepository.findByIdOrNull(professionalId)
                    ?: throw ElementNotFoundException("Professional of professionalId: $professionalId not found")

                if((professional.employment == ProfessionalEmployment.BUSY)&&(professional.jobOfferProposal == jobOffer)){
                    //set the new status
                    professional.employment = ProfessionalEmployment.EMPLOYED
                    //remove the bind between these two entities
                    jobOffer.removeCandidateProfiles(professional)
                    //remove the other candidates and set them as UNEMPLYED
                    for(p in jobOffer.candidateProfiles){
                        //remove binding
                        jobOffer.removeCandidateProfiles(p)
                        //update emplyment of each professionals in candidate list
                        p.employment = ProfessionalEmployment.UNEMPLOYED
                    }
                    jobOffer.addProfessional(professional)
                    //save the new proposal value
                    professionalRepository.save(professional)

                    //update job offer offerValue
                    val profitMargin = 1.5
                    jobOffer.offerValue =  jobOffer.duration * professional.dailyRate * profitMargin
                }else{
                    throw BadParameterException("This professional is not bounds to this jobOffer")
                }
            }
        }else if(jobOffer.status != JobStatus.CREATED && jobOffer.status != JobStatus.ABORTED && newState==JobStatus.SELECTION_PHASE){

            if(jobOffer.candidateProfiles.isNotEmpty()){
                //remove the other candidates and set them as UNEMPLYED
                for(p in jobOffer.candidateProfiles){
                    //remove binding
                    jobOffer.removeCandidateProfiles(p)
                    //update emplyment of each professionals in candidate list
                    p.employment = ProfessionalEmployment.UNEMPLOYED
                    //SAVE NEW VALUES
                    professionalRepository.save(p)
                }
            }
            val tmpProfessional = jobOffer.professional
            if(tmpProfessional != null) {
                jobOffer.removeProfessional(tmpProfessional)
                tmpProfessional.employment = ProfessionalEmployment.UNEMPLOYED
                professionalRepository.save(tmpProfessional)
            }
        }else if((jobOffer.status == JobStatus.CONSOLIDATED  && newState==JobStatus.DONE) || (newState==JobStatus.ABORTED)) {

            val tmpCustomer = jobOffer.currentCustomer ?: throw CustomerNotFoundException("customer not found")

            tmpCustomer.completeJobOffer(jobOffer)
            customerRepository.save(tmpCustomer)

            //REMOVE ONLY JOB OFFER FROM PROFESSIONAL (if it had one already) AND NOT VICEVERSA BECAUSE JOB OFFER GOES TO HISTORY
            val tmpProfessional = jobOffer.professional //?: throw ProfessionalNotFoundException("professional not found")
            if (tmpProfessional != null) {
                tmpProfessional.jobOffer = null
                tmpProfessional.employment = ProfessionalEmployment.UNEMPLOYED
                professionalRepository.save(tmpProfessional)
            }
        }
        */

        jobOffer.status = newState
        jobOfferRepository.save(jobOffer)

        logger.info("Status successfully update")

        return jobOffer.toDto()
    }

    override fun getJobOfferValue(jobOfferId: Long): Double{
        val jobOffer = jobOfferRepository.findByIdOrNull(jobOfferId)
            ?: throw ElementNotFoundException("JobOffer not found")
        /*
        if(jobOffer.professional == null) {
            throw BadParameterException("No professional bound with this jobOffer: $jobOfferId")
        }else{
            return jobOffer.offerValue
        }
        */
        return jobOffer.offerValue
    }

    @Transactional
    override fun deleteJobOffer(jobOfferId: Long) {
        val jobOffer = jobOfferRepository.findByIdOrNull(jobOfferId)
            ?: throw ElementNotFoundException("JobOffer not found")

        if (jobOffer.currentCustomer == null) {
            throw ElementNotFoundException("Costumer not found")
        } else {
            jobOffer.currentCustomer?.removeJobOffer(jobOffer)
            jobOffer.currentCustomer?.replacementHistory?.add(jobOffer)
        }
        if (jobOffer.professional != null) {
            jobOffer.professional?.removeJobOffer(jobOffer)
        }
        for(p in jobOffer.candidateProfiles){
            //remove binding
            jobOffer.removeCandidateProfiles(p)
            //update emplyment of each professionals in candidate list
            p.employment = ProfessionalEmployment.UNEMPLOYED
        }

        // Rimuovere tutte le associazioni con le Skill
        jobOffer.requiredSkills.forEach { skill ->
            skill.jobOffer.remove(jobOffer)
        }
        jobOffer.requiredSkills.clear()


        jobOfferRepository.delete(jobOffer)
        logger.info("JobOffer successfully deleted")
    }


    override fun updateNotes(jobOfferId: Long, notes: String): JobOfferDTO {
        val jobOffer = jobOfferRepository.findByIdOrNull(jobOfferId)
            ?: throw ElementNotFoundException("JobOffer not found")

        // se le note già presenti sono vuote metto uno spazio vuoto
        val oldNotes = jobOffer.notes// ?: " "

        // Concateno le nuove note alle vecchie
        val updatedNotes = "$oldNotes $notes"

        jobOffer.notes = updatedNotes
        jobOfferRepository.save(jobOffer)

        logger.info("Notes successfully updated for JobOffer")

        return jobOffer.toDto()
    }

    override fun addNotes(jobOfferId: Long, newNotes: String): JobOfferDTO {
        val jobOffer = jobOfferRepository.findByIdOrNull(jobOfferId)
            ?: throw ElementNotFoundException("JobOffer not found")

        jobOffer.notes = newNotes

        jobOfferRepository.save(jobOffer)

        logger.info("Notes successfully updated for JobOffer")

        return jobOffer.toDto()
    }

    override fun getJobOfferById(jobOfferId: Long): JobOfferDTO {
        val jobOffer = jobOfferRepository.findByIdOrNull(jobOfferId)
            ?: throw ElementNotFoundException("JobOffer not found")
        return jobOffer.toDto()
    }

    override fun updateJobOffer(
        jobOfferId: Long,
        dto:JobOfferCreateDTO
    ): JobOfferDTO{
        logger.info("Updating jobOffer with ID $jobOfferId")

        val jobOffer = jobOfferRepository.findById(jobOfferId)
            .orElseThrow { ContactNotFoundException("JobOffer with id $jobOfferId not found") }

        jobOffer.description = dto.description
        jobOffer.notes = dto.notes ?: ""
        jobOffer.duration = dto.duration
        jobOffer.offerValue = dto.offerValue

        val savedJobOffer = jobOfferRepository.save(jobOffer)
        logger.info("JobOffer updated successfully")

        return savedJobOffer.toDto()
    }

    override fun addSkill(id: Long, skill: String): JobOfferDTO {

        //check if contact exists
        val jobOffer = jobOfferRepository.findByIdOrNull(id)
            ?: throw ProfessionalNotFoundException("jobOfferId not found")

        //normalize skill name to avoid repetitions in the db
        val skillName = skill.lowercase()

        //check if the skill already exists, if not create it
        var eSkill = skillRepository.findIdBySkill(skillName)
        if(eSkill == null){
            eSkill = Skill()
            eSkill.skill = skillName
            skillRepository.save(eSkill)
            logger.info("New skill created")
        }else{
            logger.info("Skill already exist")
        }

        //add the new skill
        jobOffer.addSkill(eSkill)
        jobOfferRepository.save(jobOffer)

        logger.info("Skill added")
        return jobOffer.toDto()
    }

    override fun deleteSkill(id: Long, skillId: Long) {
        //check if professional exist
        val jobOffer = jobOfferRepository.findByIdOrNull(id)
            ?: throw BadParameterException("JobOffer id not found")

        //check if skill exist
        val skill = skillRepository.findByIdOrNull(skillId)
            ?: throw BadParameterException("skill id not found")

        //check if the contact has that skill
        if(!jobOffer.requiredSkills.contains(skill)){
            throw BadParameterException("The JobOffer $id does not have the requiredSkill $skillId")
        }

        //delete the skill from the contact
        jobOffer.removeSkill(skill)
        jobOfferRepository.save(jobOffer)

        logger.info("Skill successfully deleted from the jobOffer")
    }

    override fun updateSkill(id: Long, skillId: Long, skill: String): JobOfferDTO {
        //delete the skill from the professional (checks are already performed inside the delete fun)
        deleteSkill(id, skillId)
        //add the new skill
        return addSkill(id, skill)
    }

}
