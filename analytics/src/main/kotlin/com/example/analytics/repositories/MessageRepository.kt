package com.example.analytics.repositories

import com.example.analytics.entities.Message
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository                             //Entity , Id
interface MessageRepository:JpaRepository<Message, Long> {
}