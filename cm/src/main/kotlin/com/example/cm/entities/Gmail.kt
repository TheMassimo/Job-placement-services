package com.example.cm.entities

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id

@Entity
class Gmail {
    @Id
    @GeneratedValue
    var emailId: Long = 0

    lateinit var receiver: String
    lateinit var sender: String
    lateinit var subject: String
    lateinit var body: String
    lateinit var channel: String
}