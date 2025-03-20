package com.example.document_store.dtos

import com.example.document_store.entities.DocumentMetadata
import com.example.document_store.utils.DocumentCategory
import java.time.LocalDateTime
import java.util.*

data class DocumentMetadataDTO(
    val metadataId: Long,
    val name: String,
    val size: Long,
    val contentType: String,
    val timestamp: LocalDateTime,
    val category: DocumentCategory,
    val id: Long? = null
)

fun DocumentMetadata.toDto(): DocumentMetadataDTO =
    DocumentMetadataDTO(this.metadataId, this.name, this.size, this.contentType, this.timestamp, this.category, this.id)