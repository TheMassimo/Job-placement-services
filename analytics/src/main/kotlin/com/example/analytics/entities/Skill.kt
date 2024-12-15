package com.example.analytics.entities

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import jakarta.persistence.ManyToMany

@Entity
@JsonIgnoreProperties(value = ["professional"])
class Skill {
    @Id
    @GeneratedValue
    var skillId: Long = 0
    lateinit var skill: String

    @ManyToMany
    var professional: MutableSet<Professional> = mutableSetOf()
}