package com.example.crm.services

import com.example.crm.dtos.ProfessionalCreateDTO
import com.example.crm.dtos.ProfessionalDTO
import com.example.crm.dtos.SkillDTO
import com.example.crm.entities.Professional
import com.example.crm.entities.ProfessionalEmployment

interface ProfessionalServices {

    fun getAllProfessionals(page : Int,
                            limit : Int,
                            skills : String,
                            location : String,
                            employmentState : String): List<ProfessionalDTO>

    fun getProfessionalById(id : Long) : ProfessionalDTO

    fun create(dto : ProfessionalCreateDTO) : ProfessionalDTO

    fun deleteProfessional(professionalId:Long)

    fun updateProfessional(professionalId:Long, dto: ProfessionalCreateDTO): ProfessionalDTO

    fun addNote(id : Long, note: String) : ProfessionalDTO

    fun addSkill(id : Long, skill : String) : ProfessionalDTO

    fun deleteSkill(id : Long, skillId : Long)

    fun updateSkill(id : Long, skillId : Long, skill : String) : ProfessionalDTO

    fun updateLocation(id : Long, location : String) : ProfessionalDTO

    fun updateEmploymentState(id : Long, employmentState : ProfessionalEmployment) : ProfessionalDTO

    fun getAllSkills(id : Long?) : List<SkillDTO>

    fun getSkillByName(skill : String) : SkillDTO

}