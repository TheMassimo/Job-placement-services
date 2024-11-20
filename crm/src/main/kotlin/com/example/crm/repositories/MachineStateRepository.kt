package com.example.crm.repositories

import com.example.crm.entities.MachineState
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface MachineStateRepository: JpaRepository<MachineState, Long> {
}