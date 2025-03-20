package com.example.document_store.dtos

import com.example.document_store.utils.DocumentCategory

data class DocumentDTO(
    val name: String,
    val size: Long,
    val contentType: String,
    val category: DocumentCategory,
    val id: Long? = null,
    val data: String
)
