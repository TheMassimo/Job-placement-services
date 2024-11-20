package com.example.crm.repositories

import com.example.crm.entities.Skill
import org.springframework.stereotype.Repository
import org.springframework.data.jpa.repository.JpaRepository

@Repository
interface SkillRepository: JpaRepository<Skill, Long> {
    fun findIdBySkill(skill: String): Skill?
}
