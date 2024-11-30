package com.example.crm.services

import com.example.crm.dtos.ContactCreateDTO
import com.example.crm.dtos.ContactDTO
import com.example.crm.dtos.SkillCreateDTO
import com.example.crm.dtos.SkillDTO

interface SkillServices {
    fun create(dto: SkillCreateDTO): SkillDTO

    fun getAllSkills(): List<SkillDTO>

    fun getSkillById(id: Long): SkillDTO
}