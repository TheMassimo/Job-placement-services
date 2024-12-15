package com.example.analytics.entities

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import jakarta.persistence.ManyToMany

@Entity
class Email {
    @Id
    @GeneratedValue
    var emailId: Long = 0
    lateinit var email: String

    @ManyToMany
    var contact: MutableSet<Contact> = mutableSetOf()

}