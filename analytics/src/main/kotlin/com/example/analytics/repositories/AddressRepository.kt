package com.example.analytics.repositories

import com.example.analytics.entities.Address
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface AddressRepository: JpaRepository<Address, Long> {
    fun findIdByAddress(address: String): Address?
}