package com.example.analytics.entities

import jakarta.persistence.*

@Entity
class Location {
    @Id
    @GeneratedValue
    var locationId: Long = 0

    var location: String = ""
    var professionals: Int = 0
}

