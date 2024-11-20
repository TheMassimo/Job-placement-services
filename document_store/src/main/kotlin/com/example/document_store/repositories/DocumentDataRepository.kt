package com.example.document_store.repositories

import com.example.document_store.entities.DocumentData
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface DocumentDataRepository : JpaRepository<DocumentData, Long> {

}



