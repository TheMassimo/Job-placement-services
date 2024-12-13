package com.example.crm.services

import com.example.crm.dtos.*
import com.example.crm.entities.Category
import com.example.crm.entities.Professional
import com.example.crm.entities.ProfessionalEmployment
import com.example.crm.entities.Skill
import com.example.crm.exeptions.*
import com.example.crm.repositories.ContactRepository
import com.example.crm.repositories.ProfessionalRepository
import com.example.crm.repositories.SkillRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.data.domain.PageRequest
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.hibernate.exception.ConstraintViolationException
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.transaction.annotation.Transactional

@Service
class ProfessionalServicesImpl(private val professionalRepository: ProfessionalRepository,
                               private val skillRepository: SkillRepository,
                               private val contactRepository: ContactRepository,
                               private val contactServices: ContactServices) : ProfessionalServices {

    private val logger: Logger = LoggerFactory.getLogger(ProfessionalServices::class.java)

    override fun getAllProfessionals(page : Int,
                                     limit : Int,
                                     skills : String,
                                     location : String,
                                     employmentState : String
    ): List<ProfessionalDTO> {
        val pageable = PageRequest.of(page, limit)
        val professionals = professionalRepository.findAll(pageable)

        //apply filters
        var ritorno: List<Professional> = professionals.content
        if(skills != ""){
            ritorno = ritorno.filter { it.skills.any {x -> x.skill.contains(skills)} }
            logger.info("Professionals filtered by skills")
        }
        if(location != ""){
            ritorno = ritorno.filter { it.geographicalInfo.contains(location) }
            logger.info("Professionals filtered by location")
        }
        if(employmentState != ""){
            val professionalEmployment: ProfessionalEmployment
            try {
                professionalEmployment = ProfessionalEmployment.valueOf(employmentState.uppercase())
            } catch (e: Exception) {
                throw BadParameterException("$employmentState is not a valid employment status")
            }
            ritorno = ritorno.filter { it.employment == professionalEmployment }
            logger.info("Professionals filtered by employment state")
        }

        return ritorno.map { it.toDto() }
    }

    override fun getProfessionalById(id: Long): ProfessionalDTO {
        val professional = professionalRepository.findByIdOrNull(id)
            ?: throw ProfessionalNotFoundException("Id not found")

        logger.info("Professional fetched successfully")
        return professional.toDto()
    }

    override fun create(dto : ProfessionalCreateDTO) : ProfessionalDTO {
        val p = Professional()
        val contact = contactRepository.findByIdOrNull(dto.contactId)
            ?: throw ElementNotFoundException("Contact not found")

        // Verifica se esiste già un professionista associato al contatto
        val existingProfessional = professionalRepository.findByContact(contact)

        if (existingProfessional != null) {
            throw BadParameterException("A professional already exists for this contact")
        } else {
            dto.skills?.forEach { skillId ->
                val eSkill = skillRepository.findByIdOrNull(skillId)
                    if (eSkill == null) {
                        throw ElementNotFoundException("Skill with ID $skillId not found")
                    } else {
                        p.addSkill(eSkill)
                    }
            }

            p.employment = ProfessionalEmployment.UNEMPLOYED
            p.geographicalInfo = dto.geographicalInfo
            p.dailyRate = dto.dailyRate
            p.contact = contact
            p.notes = dto.notes

            // Salva prima il professional
            val pDTO = professionalRepository.save(p).toDto()

            // Solo dopo aggiorna la categoria del contatto
            contactServices.updateCategory(dto.contactId, Category.Professional)

            logger.info("Professional successfully created }")

            return pDTO
        }
    }

    @Transactional
    override fun deleteProfessional(professionalId:Long){
        val professional =
            professionalRepository.findById(professionalId)
                .orElseThrow { ProfessionalNotFoundException("professional not found") }

        // Rimuovo la relazione 'professional' dalle skill a cui è associato
        professional.skills.forEach { skill ->
            skill.professional.remove(professional) // Rimuovo il professionista dalla skill
        }

        // Se il contatto esiste, aggiorno la categoria e rimuovo la relazione con il professionista
        professional.contact?.let { contact ->
            contact.professional = null // Rimuovo il collegamento tra contatto e professionista
            contactServices.downgradeCategory(contact.contactId, Category.Professional) // Rimuovo anche la categoria, se necessario
        }

        try {
            professionalRepository.delete(professional)
        } catch (e: DataIntegrityViolationException) {
            if (e.cause is ConstraintViolationException) {
                throw ProfessionalProcessingException("Delete of a professional is only permitted if the professional is not associated with any job offer")
            } else {
                throw e
            }
        } catch (e: Exception) {
            throw ProfessionalProcessingException("Error occurred while deleting professional with ID $professionalId")
        }
    }


    override fun updateProfessional(professionalId:Long, dto: ProfessionalCreateDTO): ProfessionalDTO {
        logger.info("Updating professional with ID $professionalId")

        val professional = professionalRepository.findById(professionalId)
            .orElseThrow { ContactNotFoundException("Contact with id $professionalId not found") }


        professional.geographicalInfo = dto.geographicalInfo
        professional.dailyRate = dto.dailyRate
        professional.notes = dto.notes ?: ""

        val savedProfessional = professionalRepository.save(professional)
        logger.info("Professional updated successfully")

        return savedProfessional.toDto()
    }

    override fun addNote(id: Long, note: String): ProfessionalDTO {
        val professional = professionalRepository.findByIdOrNull(id)
            ?: throw ProfessionalNotFoundException("professionalId not found")

        professional.notes = note
        professionalRepository.save(professional)

        return professional.toDto()
    }

    override fun addSkill(id: Long, skill: String): ProfessionalDTO {

        //check if contact exists
        val professional = professionalRepository.findByIdOrNull(id)
            ?: throw ProfessionalNotFoundException("professionalId not found")

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
        professional.addSkill(eSkill)
        professionalRepository.save(professional)

        logger.info("Skill added")
        return professional.toDto()
    }

    override fun deleteSkill(id: Long, skillId: Long) {
        //check if professional exist
        val professional = professionalRepository.findByIdOrNull(id)
            ?: throw BadParameterException("Professional id not found")

        //check if skill exist
        val skill = skillRepository.findByIdOrNull(skillId)
            ?: throw BadParameterException("skill id not found")

        //check if the contact has that skill
        if(!professional.skills.contains(skill)){
            throw BadParameterException("The professional $id does not have the skill $skillId")
        }

        //delete the skill from the contact
        professional.removeSkill(skill)
        professionalRepository.save(professional)

        logger.info("Skill successfully deleted from the contact")
    }

    override fun updateSkill(id: Long, skillId: Long, skill: String): ProfessionalDTO {
        //delete the skill from the professional (checks are already performed inside the delete fun)
        deleteSkill(id, skillId)
        //add the new skill
        return addSkill(id, skill)
    }

    override fun updateLocation(id: Long, location: String): ProfessionalDTO {
        val professional = professionalRepository.findByIdOrNull(id)
            ?: throw ProfessionalNotFoundException("professionalId not found")

        professional.geographicalInfo = location
        professionalRepository.save(professional)

        return professional.toDto()
    }

    override fun updateEmploymentState(id: Long, employmentState: ProfessionalEmployment): ProfessionalDTO {
        val professional = professionalRepository.findByIdOrNull(id)
            ?: throw ProfessionalNotFoundException("professionalId not found")

        val newEmploymentState: ProfessionalEmployment
        try {
            newEmploymentState = employmentState
        } catch (e: Exception) {
            throw BadParameterException("$employmentState is not a valid employment status")
        }

        professional.employment = newEmploymentState
        professionalRepository.save(professional)

        return professional.toDto()
    }

    override fun getAllSkills(id: Long?): List<SkillDTO> {
        if (id != null) {
            val professional = professionalRepository.findByIdOrNull(id)
                ?: throw ProfessionalNotFoundException("professionalId not found")

            return professional.skills.map { it.toDto() }
        }
        else{
            return skillRepository.findAll().map { it.toDto() }
        }
    }

    override fun getSkillByName(skill: String): SkillDTO {
        val eSkill = skillRepository.findIdBySkill(skill)
            ?: throw ProfessionalNotFoundException("skill $skill not found")

        return eSkill.toDto()
    }
}