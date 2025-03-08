package com.example.crm.repositories

import com.example.crm.entities.Email
import com.example.crm.entities.JobOfferHistory
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface JobOfferHistoryRepository: JpaRepository<JobOfferHistory, Long> {
}






