package com.example.document_store.dtos

import com.example.document_store.entities.DocumentMetaData
import java.time.LocalDateTime
import java.util.*

data class DocumentMetaDataDTO(
    val id: Long,
    val name: String,
    val size: Number,
    val content_type: String,
    val creation_timestamp: LocalDateTime
)

fun DocumentMetaData.toDto(): DocumentMetaDataDTO =
    DocumentMetaDataDTO(this.id, this.name, this.size, this.content_type, this.creation_timestamp)