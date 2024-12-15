package com.example.analytics.repositories

import com.example.analytics.entities.MachineState
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface MachineStateRepository: JpaRepository<MachineState, Long> {
}