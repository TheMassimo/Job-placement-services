package com.example.analytics.entities

import com.example.analytics.services.State
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import java.time.LocalDateTime

@Entity
class MachineState {
    @Id
    @GeneratedValue
    var machineStateId: Long = 0

    lateinit var state: State
    lateinit var date: LocalDateTime
    lateinit var comments: String

    @ManyToOne
    var message: Message? = null
}