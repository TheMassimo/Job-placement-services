package com.example.cm.repositories

import com.example.cm.entities.Gmail
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface GmailRepository: JpaRepository<Gmail, Long> {
}