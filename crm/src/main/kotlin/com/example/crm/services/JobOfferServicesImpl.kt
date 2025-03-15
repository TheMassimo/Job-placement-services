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
import kotlinx.coroutines.Job
import java.time.LocalDateTime


@Service
class JobOfferServicesImpl(private val entityManager: EntityManager,
                           private val jobOfferRepository: JobOfferRepository,
                           private val jobOfferHistoryRepository: JobOfferHistoryRepository,
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
        val jh = JobOfferHistory()

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
        //add history
        jh.jobOfferStatus = JobStatus.CREATED
        j.addHistory(jh)
        jobOfferHistoryRepository.save(jh)

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

    @Transactional
    override fun updateJobOfferStatus(jobOfferId: Long, status: String, candidates:List<Long>): JobOfferDTO {
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

        val jobOfferHistory = JobOfferHistory()


        if(newState===JobStatus.SELECTION_PHASE){
            if(jobOffer.status == JobStatus.CONSOLIDATED){
                //recupero il candidato e lo reimposto come libero
                val professionalId = candidates[0];
                val professional = professionalRepository.findByIdOrNull(professionalId)
                    ?: throw ElementNotFoundException("Professional not found")
                //cambio lo stato del professional
                professional.employment = ProfessionalEmployment.UNEMPLOYED;

                //stacco il candidato dalla job offer
                jobOffer.removeProfessional(professional);

                //salvo le modifiche
                professionalRepository.save(professional);
            }
        }


        if(newState==JobStatus.CANDIDATE_PROPOSAL){
            if(candidates.isEmpty()){
                throw BadParameterException("Professionals id not given")
            }else{

                //aggiungo tutti i nuovi candidati alla vecchia SELECTION_PHASE
                for (professionalId in candidates) {
                    val professional = professionalRepository.findByIdOrNull(professionalId)
                        ?: throw ElementNotFoundException("Professional not found")
                    if(professional.employment != ProfessionalEmployment.UNEMPLOYED){
                        throw ProfessionalNotUnemployedException("Professional: ${professionalId} no longer unemployed")
                    }
                    insertNewApplication(jobOfferId, professionalId)
                }
                //Aggiungo i candidati anche al Candidate proposal perchè poi li modificherò
                val lastJobOfferHistory =
                    jobOffer.jobHistory.filter { it.jobOfferStatus == JobStatus.SELECTION_PHASE }
                        .maxByOrNull { it.date }!!

                lastJobOfferHistory.candidates.forEach {
                    jobOfferHistory.addJobApplication(it.professional)
                }
            }
        }

        if(newState==JobStatus.CONSOLIDATED){
            if(candidates.isEmpty()){
                throw BadParameterException("Professionals id not given")
            }else{
                //verifico che il candidato sia ancora disocupato
                val professionalId = candidates[0];
                val professional = professionalRepository.findByIdOrNull(professionalId)
                    ?: throw ElementNotFoundException("Professional not found")
                if(professional.employment != ProfessionalEmployment.UNEMPLOYED){
                    throw ProfessionalNotUnemployedException("Professional: ${professionalId} no longer unemployed")
                }

                //se quindi è ancora disponibile cambio il suo stato in occupato e vado avanti
                professional.employment = ProfessionalEmployment.EMPLOYED;

                //Trova la JobOfferHistory più recente (quindi la precedente CANDIDATE_PROPOSAL)
                val latestHistory = jobOffer.jobHistory.maxByOrNull { it.date ?: LocalDateTime.MIN }
                    ?: throw IllegalStateException("No job history found for job offer ${jobOffer.jobOfferId}")

                //Trova l'application dell'utente con professionalId specifico
                val application = latestHistory.candidates.find { it.professional.professionalId == professionalId }
                    ?: throw IllegalStateException("Application not found for Professional ID: $professionalId")

                //Modifica lo stato dell'application
                application.status = ApplicationStatus.Accepted;

                // Salva i cambiamenti
                jobOfferHistoryRepository.save(latestHistory)

                //aggiungo il professional alla jobOffer
                jobOffer.addProfessional(professional);
                //calcolo l'offer value
                val profitMargin = 1.5
                jobOffer.offerValue =  jobOffer.duration * professional.dailyRate * profitMargin
                //salvo
                jobOfferRepository.save(jobOffer)
                professionalRepository.save(professional);

                //aggiungo il candidato preso a questa nuova history
                jobOfferHistory.addJobApplication(professional, ApplicationStatus.Accepted);
            }
        }

        if (newState == JobStatus.DONE) {
            val professionalId = jobOffer.professional?.professionalId;
            val professional = professionalRepository.findByIdOrNull(professionalId)
                ?: throw ElementNotFoundException("Professional not found")
            professional.employment = ProfessionalEmployment.UNEMPLOYED;
            professionalRepository.save(professional);

            //stacco il candidato dalla job offer
            jobOffer.removeProfessional(professional);
        }

        if(newState == JobStatus.ABORTED){
            //rendo di nuovo libero il professional
            val professionalId = jobOffer.professional?.professionalId;
            if(professionalId != null) {
                val professional = professionalRepository.findByIdOrNull(professionalId)
                    ?: throw ElementNotFoundException("Professional not found")
                professional.employment = ProfessionalEmployment.UNEMPLOYED;
                professionalRepository.save(professional);
            }
            if(jobOffer.status == JobStatus.CANDIDATE_PROPOSAL){
                val latestHistory = jobOffer.jobHistory.maxByOrNull { it.date ?: LocalDateTime.MIN }
                    ?: throw IllegalStateException("No job history found for job offer ${jobOffer.jobOfferId}")

                latestHistory.candidates.forEach { application ->
                    application.status = ApplicationStatus.Aborted
                }

                jobOfferHistoryRepository.save(latestHistory);
            }
        }

        //per jobOffer
        jobOffer.status = newState
        jobOfferRepository.save(jobOffer)
        //per history
        jobOfferHistory.jobOfferStatus = jobOffer.status
        //jobOfferHistory.note = newJobOffer.notes
        jobOffer.addHistory(jobOfferHistory)
        jobOfferHistoryRepository.save(jobOfferHistory)

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
        //change the professional status
        jobOffer.professional?.let { professional ->
            professional.employment = ProfessionalEmployment.UNEMPLOYED
            professionalRepository.save(professional)
        }
        //remove professional
        if (jobOffer.professional != null) {
            jobOffer.professional?.removeJobOffer(jobOffer)
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

    override fun insertNewApplication(
        jobOfferId: Long, professionalId: Long
    ) {
        //cerca la jobOffer
        val jobOffer = jobOfferRepository.findById(jobOfferId)
            .orElseThrow { JobOfferNotFoundException("Job offer with $jobOfferId not found") }

        //se è in selection phase la può aggiungere altrimenti no
        if (jobOffer.status == JobStatus.SELECTION_PHASE) {
            //ottiene il professional
            val professional = professionalRepository.findById(professionalId).orElseThrow {
                ProfessionalNotFoundException("Professional with id: $professionalId not found")
            }


            val jobOfferHistory = jobOffer.jobHistory.filter { it.jobOfferStatus == JobStatus.SELECTION_PHASE }
                .maxByOrNull { it.date }!!

            jobOfferHistory.addJobApplication(professional)
            jobOfferHistoryRepository.save(jobOfferHistory)
        } else {
            throw JobOfferProcessingException("To add an application the status of the job offer must be equal to 'Selection Phase'")
        }
    }

    override fun deleteApplication(jobOfferId: Long, professionalId: Long) {
        //get the jobOffer
        val jobOffer = jobOfferRepository.findById(jobOfferId)
            .orElseThrow { JobOfferNotFoundException("Job offer with $jobOfferId not found") }

        //control if we are in the right sitation
        if (jobOffer.status == JobStatus.SELECTION_PHASE) {
            //get professional or error
            val professional = professionalRepository.findById(professionalId).orElseThrow {
                ProfessionalNotFoundException("Professional with id: $professionalId not found")
            }

            val jobOfferHistory = jobOffer.jobHistory.filter { it.jobOfferStatus == JobStatus.SELECTION_PHASE }
                .maxByOrNull { it.date }!!

            jobOfferHistory.removeJobApplication(jobOfferHistory.candidates.first {
                it.professional == professional
            })
            jobOfferHistoryRepository.save(jobOfferHistory)
        } else {
            throw JobOfferProcessingException("To remove an application the status of the job offer must be equal to 'Selection Phase'")
        }
    }

    override fun getJobOfferHistory(jobOfferId: Long): List<JobOfferHistoryDTO> {
        return jobOfferRepository.findById(jobOfferId)
            .orElseThrow { JobOfferNotFoundException("Job offer with $jobOfferId not found") }.jobHistory.map { it.toDto() }
    }

    override fun getJobOfferNewestHistory(jobOfferId: Long): JobOfferHistoryDTO? {
        return jobOfferRepository.findById(jobOfferId)
            .orElseThrow { JobOfferNotFoundException("Job offer with $jobOfferId not found") }
            .jobHistory.map { it.toDto() }
            .maxByOrNull { it.date ?: LocalDateTime.MIN } // Se `date` è null, usa `LocalDateTime.MIN`
    }

    override fun updateJobOfferHistoryNote(jobOfferId: Long, note:String): JobOfferHistoryDTO? {
        val lastHistoryDTO = getJobOfferNewestHistory(jobOfferId)
            ?: throw ElementNotFoundException("No history found for job offer $jobOfferId")

        val lastHistory = jobOfferHistoryRepository.findById(lastHistoryDTO.jobOfferHistoryId)
            .orElseThrow { ElementNotFoundException("JobOfferHistory with ID ${lastHistoryDTO.jobOfferHistoryId} not found") }

        lastHistory.note = note  // Supponendo che `note` sia una proprietà mutabile
        jobOfferHistoryRepository.save(lastHistory)  // Salva le modifiche

        return lastHistory.toDto();
    }

}
