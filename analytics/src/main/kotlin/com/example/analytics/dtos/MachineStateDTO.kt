package com.example.analytics.dtos

import com.example.analytics.entities.MachineState
import java.time.LocalDateTime

data class MachineStateDTO (
    val machineStateId : Long,
    val state: String,
    val date: LocalDateTime,
    val comments: String
)

fun MachineState.toDto(): MachineStateDTO =
    MachineStateDTO(
        this.machineStateId,
        this.state.name,
        this.date,
        this.comments
    )