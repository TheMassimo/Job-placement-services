package com.example.document_store.repositories

import com.example.document_store.entities.DocumentMetaData
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository                                        // EntityName    , Id
interface DocumentMetaDataRepository: JpaRepository<DocumentMetaData, Long> {
    fun findByNameIgnoreCase(name : String) : List<DocumentMetaData>
}
