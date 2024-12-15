package com.example.analytics.dtos

import com.example.analytics.entities.Skill

data class SkillDTO (
    val skillId: Long,
    val name: String
)

fun Skill.toDto(): SkillDTO =
    SkillDTO(
        this.skillId,
        this.skill
    )