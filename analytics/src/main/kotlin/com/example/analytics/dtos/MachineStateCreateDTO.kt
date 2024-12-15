package com.example.analytics.dtos

import java.time.LocalDateTime

data class MachineStateCreateDTO(val state: String,
                                 val date: LocalDateTime,
                                 val comments: String)
