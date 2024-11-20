package com.example.document_store.dtos

import org.springframework.util.unit.DataSize
import java.time.LocalDateTime
import java.util.Date

data class CreateDocumentMetaDataDTO(
                                    val name: String,
                                    val size: Number,
                                    val content_type: String,
                                    val creation_timestamp: LocalDateTime)
