package com.example.crm.entities

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import jakarta.persistence.ManyToMany

@Entity
class Address {
    @Id
    @GeneratedValue
    var addressId: Long = 0
    lateinit var address: String

    @ManyToMany
    var contact: MutableSet<Contact> = mutableSetOf()
}
