package com.example.crm.dtos

import com.example.crm.entities.Skill

data class SkillDTO (
    val skillId: Long,
    val skill: String
)

fun Skill.toDto(): SkillDTO =
    SkillDTO(
        this.skillId,
        this.skill
    )