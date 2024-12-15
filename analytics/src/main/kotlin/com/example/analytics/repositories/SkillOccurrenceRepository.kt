package com.example.analytics.repositories

import com.example.analytics.entities.Skill
import com.example.analytics.entities.SkillOccurrence
import org.springframework.stereotype.Repository
import org.springframework.data.jpa.repository.JpaRepository

@Repository
interface SkillOccurrenceRepository: JpaRepository<SkillOccurrence, Long> {
    fun findIdByJobOfferIdAndSkill(jobOfferId: Long, skill: String): SkillOccurrence?
    fun findByJobOfferId(jobOfferId: Long): SkillOccurrence?
    fun existByJobOfferIdAndSkill(jobOfferId: Long, skill: String): Boolean
}
