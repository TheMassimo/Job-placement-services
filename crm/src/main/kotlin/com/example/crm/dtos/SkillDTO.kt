package com.example.crm.dtos

import com.example.crm.entities.Skill

data class SkillDTO (
    val skillId: Long,
    val name: String
)

fun Skill.toDto(): SkillDTO =
    SkillDTO(
        this.skillId,
        this.skill
    )