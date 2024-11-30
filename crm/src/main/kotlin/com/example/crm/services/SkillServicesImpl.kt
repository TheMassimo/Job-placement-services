package com.example.crm.services

import com.example.crm.dtos.CustomerDTO
import com.example.crm.dtos.SkillCreateDTO
import com.example.crm.dtos.SkillDTO
import com.example.crm.dtos.toDto
import com.example.crm.entities.Skill
import com.example.crm.exeptions.CustomerNotFoundException
import com.example.crm.exeptions.ElementNotFoundException
import com.example.crm.repositories.SkillRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class SkillServicesImpl(private val skillRepository: SkillRepository
): SkillServices  {

    private val logger: Logger = LoggerFactory.getLogger(SkillServices::class.java)
    override fun create(
        dto: SkillCreateDTO
    ): SkillDTO {
        val s = Skill()

        s.skill = dto.name

        val sDTO = skillRepository.save(s).toDto()
        logger.info("Skill successfully created")

        return  sDTO
    }

    override fun getAllSkills(): List<SkillDTO> {
        return skillRepository.findAll().map { it.toDto() }
    }


    override fun getSkillById(id: Long): SkillDTO {
        val skill = skillRepository.findByIdOrNull(id)
            ?: throw ElementNotFoundException("skill id does not exist")
        return skill.toDto()
    }



}
