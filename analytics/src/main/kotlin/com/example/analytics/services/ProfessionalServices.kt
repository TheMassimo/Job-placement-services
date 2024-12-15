package com.example.analytics.services

import com.example.analytics.dtos.ProfessionalCreateDTO
import com.example.analytics.dtos.ProfessionalDTO
import com.example.analytics.dtos.SkillDTO

interface ProfessionalServices {

    fun getAllProfessionals(page : Int,
                            limit : Int,
                            skills : String,
                            location : String,
                            employmentState : String): List<ProfessionalDTO>

    fun getProfessionalById(id : Long) : ProfessionalDTO

    fun create(dto : ProfessionalCreateDTO) : ProfessionalDTO

    fun addNote(id : Long, note: String) : ProfessionalDTO

    fun addSkill(id : Long, skill : String) : ProfessionalDTO

    fun deleteSkill(id : Long, skillId : Long)

    fun updateSkill(id : Long, skillId : Long, skill : String) : ProfessionalDTO

    fun updateLocation(id : Long, location : String) : ProfessionalDTO

    fun updateEmploymentState(id : Long, employmentState : String) : ProfessionalDTO

    fun getAllSkills(id : Long?) : List<SkillDTO>

    fun getSkillByName(skill : String) : SkillDTO

}