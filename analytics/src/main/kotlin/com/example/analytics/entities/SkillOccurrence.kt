package com.example.analytics.entities

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import jakarta.persistence.OneToOne

@Entity
class SkillOccurrence {
    @Id
    @GeneratedValue
    var skillInstanceId: Long = 0
    var jobOfferId: Long = 0
    lateinit var skill: String
}