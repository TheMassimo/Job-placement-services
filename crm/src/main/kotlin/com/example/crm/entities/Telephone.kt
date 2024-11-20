package com.example.crm.entities

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import jakarta.persistence.ManyToMany

@Entity
class Telephone {
    @Id
    @GeneratedValue
    var telephoneId: Long = 0

    lateinit var telephone: String

    @ManyToMany
    var contact: MutableSet<Contact> = mutableSetOf()

}