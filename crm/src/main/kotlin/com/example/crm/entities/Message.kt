package com.example.crm.entities

import com.example.crm.services.State
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import java.time.LocalDateTime

@Entity
class Message {

    @Id
    @GeneratedValue
    val messageId: Long = 0

    lateinit var sender: String
    lateinit var date: LocalDateTime
    lateinit var channel: String
    lateinit var subject: String
    lateinit var body: String
    var priority: Int = 5 // 0 is the default value
    var state: State = State.RECEIVED

    @OneToMany(mappedBy = "message")
    var machineState: MutableSet<MachineState> = mutableSetOf()

    fun addMachineState(s : MachineState){
        s.message = this
        machineState.add(s)
        state = s.state
    }

}