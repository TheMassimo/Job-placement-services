package com.example.crm.repositories

import com.example.crm.entities.Message
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository                             //Entity , Id
interface MessageRepository:JpaRepository<Message, Long> {
}