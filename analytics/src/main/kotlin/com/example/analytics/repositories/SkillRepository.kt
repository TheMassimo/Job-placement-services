package com.example.analytics.repositories

import com.example.analytics.entities.Skill
import org.springframework.stereotype.Repository
import org.springframework.data.jpa.repository.JpaRepository

@Repository
interface SkillRepository: JpaRepository<Skill, Long> {
    fun findIdBySkill(skill: String): Skill?
}
