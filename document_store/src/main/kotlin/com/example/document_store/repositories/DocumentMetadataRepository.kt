package com.example.document_store.repositories

import com.example.document_store.entities.DocumentMetadata
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.data.repository.PagingAndSortingRepository

@Repository                                        // EntityName    , Id
interface DocumentMetadataRepository : JpaRepository<DocumentMetadata, Long>,
    PagingAndSortingRepository<DocumentMetadata, Long> {
    fun findByName(name: String): List<DocumentMetadata>
}
